import type { TGetProductByIdRequest, TGetProductByIdResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "GetProductDetailsByIdService"

//--- get by id ----------------------------------
export async function getProductbyIdAsync(data: TGetProductByIdRequest)
    : Promise<Result<TGetProductByIdResponse>> 
{
    try {
        
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}