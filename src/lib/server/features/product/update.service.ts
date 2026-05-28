import type { TUpdateCategoryByIdResponse, TUpdateProductByIdRequest } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "UpdateProductService" as const

//--- update by id -------------------------------
export async function updateProductByIdAsync(data: TUpdateProductByIdRequest)
    : Promise<Result<TUpdateCategoryByIdResponse>> 
{
    try {

    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}