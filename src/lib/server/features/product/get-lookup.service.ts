import { categories, db, products } from "$lib/server/data";
import type { TGetProductLookupResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";
import { and, eq } from "drizzle-orm";

const DOMAIN = "GetProductLookupService" as const

//--- get lookup list ---------------------------------
export async function getProductListAsync()
    : Promise<Result<TGetProductLookupResponse[]>> 
{
    try {
        const queryProduct = await db
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
                isActive: products.isActive,
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
            .where(eq(products.isSoftDeleted, false))

        const response: TGetProductLookupResponse[] = queryProduct.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            thumbnailPicture: product.thumbnailPicture,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
            type: product.type,
            images: product.images,
            isActive: product.isActive,
            categoryParent: {
                id: product.categoryParent.id,
                name: product.categoryParent.name ?? "Uncategorized"
            }
        }))

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}