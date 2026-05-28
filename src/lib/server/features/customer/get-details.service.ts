import { customers, db } from "$lib/server/data";
import { GetCustomerByIdScheme, type TGetCustomerByIdRequest, type TGetCustomerByIdResponse } from "$lib/types/features";
import { Result, STATUS_CODE } from "$lib/types/global";
import { eq } from "drizzle-orm";

const DOMAIN = "GetCustomerByIdService" as const

export async function getCustomerByIdAsync(data: TGetCustomerByIdRequest)
    : Promise<Result<TGetCustomerByIdResponse>>
{
    const validation = GetCustomerByIdScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: customerId } = validation.data

    try {
        const [queryCustomer] = await db
            .select({
                id: customers.id,
                name: customers.name,
                phone: customers.phone,
                instagramUrl: customers.instagramUrl,
                updatedAt: customers.updatedAt,
                createdAt: customers.createdAt
            })
            .from(customers)
            .where(eq(customers.id, customerId))
            .limit(1)

        if (!queryCustomer)
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Customer with ID: ${customerId} not found.`,
                domain: DOMAIN
            })

        return Result.success(queryCustomer)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}