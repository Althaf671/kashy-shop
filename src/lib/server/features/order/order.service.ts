import type { Result } from "$lib/global/shared.types";
import type { TCreateOrderItemsRequest, TCreateOrderRequest, TCreateOrderResponse, TGetOrderByIdRequest, TGetOrderByIdResponse, TGetOrderLookupResponse, TUpdateOrderByIdRequest, TUpdateorderByIdResponse } from "./order.schema";

//--- create order items -------------------------
export async function createOrderItemsAsync(data: TCreateOrderItemsRequest) 
    : Promise<Result<boolean>>
{

}

//--- create order -------------------------------
export async function createOrderAsync(data: TCreateOrderRequest)
    : Promise<Result<TCreateOrderResponse>>
{

}

//--- update by id -------------------------------
export async function updateOrderByIdAsync(data: TUpdateOrderByIdRequest)
    : Promise<Result<TUpdateorderByIdResponse>>
{

}

//--- get by id ----------------------------------
export async function getOrderByIdAsync(data: TGetOrderByIdRequest)
    : Promise<Result<TGetOrderByIdResponse>>
{

}

//--- get lookup list ----------------------------
export async function getOrderLookupListAsync()
    : Promise<Result<TGetOrderLookupResponse[]>>
{
    
}