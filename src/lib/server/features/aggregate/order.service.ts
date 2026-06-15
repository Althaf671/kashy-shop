import { Result } from "$lib/types/global";

const DOMAIN = "OrderAggregateService" as const

export async function getOrderAggregateDataAsync()
    : Promise<Result<string[]>>
{
    try {
        // get completed orders

        // get order pending

        // get order on progress

        // get order cancelled

        return Result.success()
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}