import { categories, db, products } from "$lib/server/data";
import { deleteFileByPublicIdAsync, findSpecificErrorValues, processAndUploadThumbnailAsync } from "$lib/server/utils";
import { CreateProductScheme, type TCreateProductRequest, type TCreateProductResponse } from "$lib/types/features";
import { KASH, Result, STATUS_CODE, type TCloudinaryImage } from "$lib/types/global";
import { and, eq, ilike, or } from "drizzle-orm";

const DOMAIN = "CreateProductService" as const

//--- create -------------------------------------
export async function createProductAsync(data: TCreateProductRequest)
    : Promise<Result<TCreateProductResponse>> 
{
    const validation = CreateProductScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data

    let finalThumbnail: TCloudinaryImage | undefined = undefined
    let finalImages: TCloudinaryImage[] = []

    try {
        // check is targeted category is actually exist.
        const [isCategoryExist] = await db
            .select({ id: categories.id })
            .from(categories)
            .where(and(
                eq(categories.id, payload.categoryId),
                eq(categories.isSoftDeleted, false)
            ))
            .limit(1)
        if (!isCategoryExist)
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${payload.categoryId} not found.`,
                domain: DOMAIN
            })

        // check if there any product with same slug exist and product with same name
        // from same category exist.
        const [isProductExist] = await db
            .select({ 
                id: products.id,
                name: products.name,
                categoryId: products.categoryId,
                slug: products.slug 
            })
            .from(products)
            .where(and(
                eq(products.isSoftDeleted, false),
                or(
                    and(
                        ilike(products.name, payload.name),
                        eq(products.categoryId, payload.categoryId),
                    ),
                    eq(products.slug, payload.slug)
                )
            ))
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

        // parallel upload thumbnail and images.
        const thumbnailTask = processAndUploadThumbnailAsync(payload.thumbnailPicture)
        const imageTasks = payload.images.map((file) => processAndUploadThumbnailAsync(file))

        const [thumbnailMetadata, ...imageMetadas] = await Promise.all([
            thumbnailTask, 
            ...imageTasks
        ])

        if (thumbnailMetadata.isFailure) return Result.failure(thumbnailMetadata.error)

        const failedImageUpload = imageMetadas.find(res => res.isFailure)
        if (failedImageUpload) return Result.failure(failedImageUpload.error)

        finalThumbnail = thumbnailMetadata.value!
        finalImages = imageMetadas.map(res => res.value!)

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
        // if somehow database crashed while creating, remove the new thumbnail and images from storage.
        if (finalThumbnail !== undefined) 
            await deleteFileByPublicIdAsync(finalThumbnail.publicId).catch((error) => {
                console.warn("[WARNING]: Failed to delete previoud image", error)
            })

        if (finalImages.length > 0)
            await Promise.all(
                finalImages.map((file) => deleteFileByPublicIdAsync(file.publicId).catch((error) => {
                    console.warn("[WARNING]: Failed to delete one or more previous images.", error)
                }))
            )

        return Result.serverError(error, DOMAIN)
    }
}