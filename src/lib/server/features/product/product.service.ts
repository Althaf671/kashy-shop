import { STATUS_CODE } from "$lib/global/constant.type";
import { Result } from "$lib/global/shared.types";
import type { TUpdateCategoryByIdResponse } from "../category/category.schema";
import { 
    CreateProductScheme, 
    DeleteProductByIdScheme, 
    GetProductByIdScheme, 
    UpdateProductByIdScheme, 
    type TCreateProductRequest, 
    type TCreateProductResponse, 
    type TDeleteProductByIdRequest, 
    type TGetProductByIdRequest, 
    type TGetProductByIdResponse, 
    type TGetProductLookupResponse, 
    type TUpdateProductByIdRequest 
} from "./product.schema";

const DOMAIN = "ProductService" as const

//--- create -------------------------------------
export async function createProductAsync(data: TCreateProductRequest)
    : Promise<Result<TCreateProductResponse>> 
{
    // input validation
    const validation = CreateProductScheme.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- update by id -------------------------------
export async function updateProductByIdAsync(data: TUpdateProductByIdRequest)
    : Promise<Result<TUpdateCategoryByIdResponse>> 
{
    // input validation
    const validation = UpdateProductByIdScheme.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- delete by id -------------------------------
export async function deleteProductByIdAsync(data: TDeleteProductByIdRequest)
    : Promise<Result<string>> 
{
    // input validation
    const validation = DeleteProductByIdScheme.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- get by id ----------------------------------
export async function getProductbyIdAsync(data: TGetProductByIdRequest)
    : Promise<Result<TGetProductByIdResponse>> 
{
    // input validation
    const validation = GetProductByIdScheme.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- get lookup list ---------------------------------
export async function getProductListAsync()
    : Promise<Result<TGetProductLookupResponse[]>> 
{
    try {
        
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}
