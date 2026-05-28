import { customers, db } from "$lib/server/data";
import type { TGetCustomerLookupResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "GetCustomerLookupService" as const

export async function getCustomerLookupListAsync()
    : Promise<Result<TGetCustomerLookupResponse[]>>
{
    try {
        const queryCustomer = await db
            .select({
                id: customers.id,
                name: customers.name,
                phone: customers.phone,
                instagramUrl: customers.instagramUrl 
            })
            .from(customers)

        const response: TGetCustomerLookupResponse[] = queryCustomer.map((customer) => ({
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            instagramUrl: customer.instagramUrl
        }))

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}