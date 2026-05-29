import { categories, db, products } from "$lib/server/data";
import { GetProductByIdScheme, type TGetProductByIdRequest, type TGetProductByIdResponse } from "$lib/types/features";
import { Result, STATUS_CODE } from "$lib/types/global";
import { and, eq } from "drizzle-orm";

const DOMAIN = "GetProductDetailsByIdService"

//--- get by id ----------------------------------
export async function getProductbyIdAsync(data: TGetProductByIdRequest)
    : Promise<Result<TGetProductByIdResponse>> 
{
    const validation = GetProductByIdScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: productId } = validation.data

    try {
        const [queryProduct] = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                thumbnailPicture: products.thumbnailPicture,
                slug: products.slug,
                price: products.price,
                stock: products.stock,
                type: products.type,
                images: products.images,
                isSoftDeleted: products.isSoftDeleted,
                isActive: products.isActive,
                updatedAt: products.updatedAt,
                createdAt: products.createdAt,
                categoryParent: {
                    id: products.categoryId,
                    name: categories.name 
                }
            })
            .from(products)
            .leftJoin(categories, and(
                eq(categories.id, products.categoryId),
                eq(categories.isSoftDeleted, false)
            ))
            .where(and(
                eq(products.id, productId),
                eq(products.isSoftDeleted, false)
            ))
        
        if (!queryProduct)
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Product with ID: ${productId} not found.`,
                domain: DOMAIN
            })

        const response: TGetProductByIdResponse = {
            id: queryProduct.id,
            name: queryProduct.name,
            description: queryProduct.description,
            thumbnailPicture: queryProduct.thumbnailPicture,
            slug: queryProduct.slug,
            price: queryProduct.price,
            stock: queryProduct.stock,
            type: queryProduct.type,
            images: queryProduct.images,
            isActive: queryProduct.isActive,
            updatedAt: queryProduct.updatedAt,
            createdAt: queryProduct.createdAt,
            categoryParent: {
                id: queryProduct.categoryParent.id,
                name: queryProduct.categoryParent.name ?? "Uncategorized"
            }
        }

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}