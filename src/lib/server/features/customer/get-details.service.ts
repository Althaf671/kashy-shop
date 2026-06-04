import { messages, statusCodes } from "$lib/constants";
import { customers, db } from "$lib/server/data";
import { GetCustomerByIdScheme, type TGetCustomerByIdRequest, type TGetCustomerByIdResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";
import { and, eq } from "drizzle-orm";

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
            .where(and(
                eq(customers.id, customerId),
                eq(customers.isSoftDeleted, false)
            ))
            .limit(1)

        if (!queryCustomer)
            return Result.failure({
                code: statusCodes.NOT_FOUND,
                description: messages.NOT_FOUND("Customer", customerId),
                domain: DOMAIN
            })

        return Result.success(queryCustomer)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}