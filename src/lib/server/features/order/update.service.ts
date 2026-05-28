import type { TUpdateOrderByIdRequest, TUpdateorderByIdResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "UpdateOrderService" as const

//--- update by id -------------------------------
export async function updateOrderByIdAsync(data: TUpdateOrderByIdRequest)
    : Promise<Result<TUpdateorderByIdResponse>>
{
    try {
        
    } catch (error: unknown) {
        Result.serverError(error, DOMAIN)
    }
}