import type { TGetProductLookupResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";

const DOMAIN = "GetProductLookupService" as const

//--- get lookup list ---------------------------------
export async function getProductListAsync()
    : Promise<Result<TGetProductLookupResponse[]>> 
{
    try {
        
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}