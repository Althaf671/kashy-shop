import { customers, db } from "$lib/server/data";
import { CreateCustomerScheme, type TCreateCustomerRequest, type TCreateCustomerResponse } from "$lib/types/features";
import { Result, STATUS_CODE } from "$lib/types/global";
import { eq } from "drizzle-orm";

const DOMAIN = "CreateCustomerService" as const

export async function createCustomerAsync(data: TCreateCustomerRequest) 
    : Promise<Result<TCreateCustomerResponse>>
{
    const validation = CreateCustomerScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data

    try {
        const [isPhoneExist] = await db
            .select({ id: customers.id, isSoftDeleted: customers.isSoftDeleted })
            .from(customers)
            .where(eq(customers.phone, payload.phone))
            .limit(1)
        
        if (isPhoneExist) {
            if (!isPhoneExist.isSoftDeleted) {
                return Result.failure({
                    code: STATUS_CODE.DUPLICATED,
                    description: `Phone number ${payload.phone} is already exist, use another one.`,
                    domain: DOMAIN
                })
            }

            const [restoreCustomer] = await db
                .update(customers)
                .set({
                    name: payload.name,
                    instagramUrl: payload.instagramUrl,
                    isSoftDeleted: false,
                    updatedAt: new Date()
                })
                .where(eq(customers.id, isPhoneExist.id))
                .returning()

            const response: TCreateCustomerResponse = {
                id: restoreCustomer.id,
                name: restoreCustomer.name
            }

            return Result.success(response)
        }

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
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}