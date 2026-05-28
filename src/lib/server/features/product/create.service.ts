import { categories, db, products } from "$lib/server/data";
import { findSpecificErrorValues, processAndUploadThumbnailAsync } from "$lib/server/utils";
import { CreateProductScheme, type TCreateProductRequest, type TCreateProductResponse } from "$lib/types/features";
import { KASH, Result, STATUS_CODE } from "$lib/types/global";
import { and, eq, ilike, or } from "drizzle-orm";

const DOMAIN = "CreateProductService" as const

//--- create -------------------------------------
export async function createProductAsync(data: TCreateProductRequest)
    : Promise<Result<TCreateProductResponse>> 
{
    const validation = CreateProductScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data

    try {
        const [isCategoryExist] = await db
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.id, payload.categoryId))
            .limit(1)

        if (!isCategoryExist)
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${payload.categoryId} not found.`,
                domain: DOMAIN
            })

        const [isProductExist] = await db
            .select({ 
                id: products.id,
                name: products.name,
                categoryId: products.categoryId,
                slug: products.slug 
            })
            .from(products)
            .where(
                or(
                    and(
                        ilike(products.name, payload.name),
                        eq(products.categoryId, payload.categoryId),
                    ),
                    eq(products.slug, payload.slug)
                )
            )
            .limit(1)

        if (isProductExist) {
            const specificReason = findSpecificErrorValues(
                { ori: isProductExist.categoryId, current: payload.categoryId },
                { ori: isProductExist.name, current: payload.name },
                { ori: isProductExist.slug, current: payload.slug },
            )
            const errMsg = `Category with ${specificReason} already exists, ${KASH}.`

            return Result.failure({
                code: STATUS_CODE.DUPLICATED,
                description: `Field with value ${errMsg} already exist, use another one.`,
                domain: DOMAIN
            })
        }

        // parallel task
        const thumbnailTask = processAndUploadThumbnailAsync(payload.thumbnailPicture)
        const imageTasks = payload.images.map((file) => processAndUploadThumbnailAsync(file))

        const [thumbnailMetadata, ...imageMetadas] = await Promise.all([
            thumbnailTask, 
            ...imageTasks
        ])

        if (thumbnailMetadata.isFailure) return Result.failure(thumbnailMetadata.error)

        const failedImageUpload = imageMetadas.find(res => res.isFailure)
        if (failedImageUpload) return Result.failure(failedImageUpload.error)

        const finalThumbnail = thumbnailMetadata.value!
        const finalImages = imageMetadas.map(res => res.value!)

        const [createdProduct] = await db
            .insert(products)
            .values({
                name: payload.name,
                description: payload.description,
                thumbnailPicture: finalThumbnail,
                slug: payload.slug,
                price: payload.price,
                stock: payload.stock,
                type: payload.type,
                images: finalImages,
                isActive: payload.isActive,
                categoryId: payload.categoryId
            })
            .returning()

        // response
        const response: TCreateProductResponse = {
            id: createdProduct.id,
            slug: createdProduct.slug
        }

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}