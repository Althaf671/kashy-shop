import type { TCreateOrderItemsRequest, TCreateOrderRequest, TCreateOrderResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "CreateOrderService" as const

//--- create order items -------------------------
export async function createOrderItemsAsync(data: TCreateOrderItemsRequest) 
    : Promise<Result<boolean>>
{
    try {
        
    } catch (error: unknown) {
        Result.serverError(error, DOMAIN)
    }
}

//--- create order -------------------------------
export async function createOrderAsync(data: TCreateOrderRequest)
    : Promise<Result<TCreateOrderResponse>>
{
    try {
        
    } catch (error: unknown) {
        Result.serverError(error, DOMAIN)
    }
}