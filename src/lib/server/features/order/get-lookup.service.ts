import type { TGetOrderLookupResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "GetOrderLookupService" as const

//--- get lookup list ----------------------------
export async function getOrderLookupListAsync()
    : Promise<Result<TGetOrderLookupResponse[]>>
{
    try {
        
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}