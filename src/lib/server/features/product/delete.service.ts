import type { TDeleteProductByIdRequest } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "DeleteProductService" as const

//--- delete by id -------------------------------
export async function deleteProductByIdAsync(data: TDeleteProductByIdRequest)
    : Promise<Result<string>> 
{
    try {
        
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}