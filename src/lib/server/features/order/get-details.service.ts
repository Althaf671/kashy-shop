import type { TGetOrderByIdRequest, TGetOrderByIdResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "GetOrderDetailsService" as const

//--- get by id ----------------------------------
export async function getOrderByIdAsync(data: TGetOrderByIdRequest)
    : Promise<Result<TGetOrderByIdResponse>>
{
    try {
        
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}