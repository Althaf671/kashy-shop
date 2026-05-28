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

    const { name, phone, instagramUrl } = validation.data

    try {
        const [isPhoneExist] = await db
            .select({ id: customers.id })
            .from(customers)
            .where(eq(customers.phone, phone))
            .limit(1)
        
        if (isPhoneExist) 
            return Result.failure({
                code: STATUS_CODE.DUPLICATED,
                description: `Phone number ${phone} is already exist, use another one.`,
                domain: DOMAIN
            })

        const [insertedCustomer] = await db
            .insert(customers)
            .values({
                name: name,
                phone: phone,
                instagramUrl: instagramUrl
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