import { customers, db } from "$lib/server/data";
import { CreateCustomerScheme, type TCreateCustomerRequest, type TCreateCustomerResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";
import { and, eq } from "drizzle-orm";

const DOMAIN = "CreateCustomerService" as const


export async function createCustomerAsync(data: TCreateCustomerRequest) 
    : Promise<Result<TCreateCustomerResponse>>
{
    const validation = CreateCustomerScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data

    try {
        const existingCustomer = await findAndSyncCustomerByPhoneAsync(payload.name, payload.phone, payload.instagramUrl)
        if (!existingCustomer.value.isFound) {
            const [insertedCustomer] = await db
                .insert(customers)
                .values({
                    name: payload.name,
                    phone: payload.phone,
                    instagramUrl: payload.instagramUrl
                })
                .returning()
            
            const response: TCreateCustomerResponse = {
                id: insertedCustomer.id,
                name: insertedCustomer.name
            }

            return Result.success(response)
        }

        const response: TCreateCustomerResponse = {
            id: existingCustomer.value.id!,
            name: existingCustomer.value.name!
        }

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

//--- helper -------------------------------------
async function findAndSyncCustomerByPhoneAsync(name: string, phone: string, instagramUrl: string | undefined)
    : Promise<Result<{ isFound: boolean, id: string | undefined, name: string | undefined }>> 
{
    const [existingCustomer] = await db
        .select({ 
            id: customers.id, 
            name: customers.name,
            instagramUrl: customers.instagramUrl
        })
        .from(customers)
        .where(and(
            eq(customers.phone, phone),
            eq(customers.isSoftDeleted, false)
        ))
        .limit(1)

    if (existingCustomer) {
        await db
            .update(customers)
            .set({
                name: name ?? existingCustomer.name,
                phone: phone,
                instagramUrl: instagramUrl ?? existingCustomer.instagramUrl
            })
            .where(eq(customers.id, existingCustomer.id))
            .returning()

        return Result.success({ isFound: true, id: existingCustomer.id, name: existingCustomer.name })
    }

    return Result.success({ isFound: false, id: undefined, name: undefined })
}