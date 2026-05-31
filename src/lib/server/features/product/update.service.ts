import { and, eq, ilike, ne, notInArray } from "drizzle-orm";
import { db, orderItems, orders, products } from "$lib/server/data";
import { Result, STATUS_CODE, type TCloudinaryFile } from "$lib/types/global";
import { cleanupPreviousFileAsync, processAndUploadMultiImagesAsync } from "$lib/server/utils";
import { UpdateProductByIdScheme, type TUpdateProductByIdRequest, type TUpdateProductByIdResponse } from "$lib/types/features";

//--- update by id -------------------------------
const DOMAIN = "UpdateProductService" as const

export async function updateProductByIdAsync(data: TUpdateProductByIdRequest)
    : Promise<Result<TUpdateProductByIdResponse>> 
{
    const validation = UpdateProductByIdScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: productId, data: patchData } = validation.data

    let prevThumbnail: TCloudinaryFile | undefined = undefined
    let prevImages: TCloudinaryFile[] = []

    let finalThumbnail: TCloudinaryFile | undefined = undefined
    let finalImages: TCloudinaryFile[] = []

    try {
        const existingProduct = await checkProductAvailabilityAsync(productId)
        if (existingProduct.isFailure) return Result.failure(existingProduct.error)

        const isProductInActive = await isProductInActiveOrdersAsync(productId)
        if (isProductInActive.isFailure) return Result.failure(isProductInActive.error)

        if (patchData.slug !== undefined) {
            const isSlugDuplicated = await isSlugDuplicatedAsync(productId, patchData.slug)
            if (isSlugDuplicated.isFailure) return Result.failure(isSlugDuplicated.error)
        }

        const resolvedCategoryId = patchData.categoryId ?? existingProduct.value.categoryId
        const resolvedName = patchData.name ?? existingProduct.value.name
        
        if (patchData.name !== undefined || patchData.categoryId !== undefined) {
            const isNameDuplicated = await isNameDuplicatedInCategoryAsync(productId, resolvedCategoryId, resolvedName)
            if (isNameDuplicated.isFailure) return Result.failure(isNameDuplicated.error)
        }

        if (patchData.thumbnailPicture !== undefined || patchData.images !== undefined) {
            const multiMediaResult = await processAndUploadMultiImagesAsync(patchData.thumbnailPicture, patchData.images)
            if (multiMediaResult.isFailure) return Result.failure(multiMediaResult.error)

            const { thumbnailResult, imagesResult } = multiMediaResult.value
            const thumbnailPicture = existingProduct.value.thumbnailPicture
            const images = existingProduct.value.images

            if (thumbnailResult) {
                prevThumbnail = thumbnailPicture
                finalThumbnail = thumbnailResult
            }

            if (imagesResult !== undefined && imagesResult && imagesResult.length > 0) {
                prevImages = images
                finalImages = imagesResult
            }
        }

        const [updatedProduct] = await db
            .update(products)
            .set({
                ...(patchData.name !== undefined && { name: patchData.name }),
                ...(patchData.description !== undefined && { description: patchData.description }),
                ...(patchData.thumbnailPicture !== undefined && { thumbnailPicture: finalThumbnail }),
                ...(patchData.slug !== undefined && { slug: patchData.slug }),
                ...(patchData.price !== undefined && { price: patchData.price }),
                ...(patchData.stock !== undefined && { stock: patchData.stock }),
                ...(patchData.type !== undefined && { type: patchData.type }),
                ...(patchData.images !== undefined && { images: finalImages }),
                ...(patchData.isActive !== undefined && { isActive: patchData.isActive }),
                ...(patchData.categoryId !== undefined && { categoryId: patchData.categoryId }),
                updatedAt:  new Date()
            })
            .where(eq(products.id, productId))
            .returning()

            await cleanupPreviousFileAsync(prevThumbnail, prevImages)

            const response: TUpdateProductByIdResponse = {
                id: updatedProduct.id,
                slug: updatedProduct.slug
            }

            return Result.success(response)
    } catch (error: unknown) {
        await cleanupPreviousFileAsync(finalThumbnail, finalImages)
        return Result.serverError(error, DOMAIN)
    }
}

//--- helper -------------------------------------
// find existing product
async function checkProductAvailabilityAsync(productId: string)
    : Promise<Result<{
        isActive: boolean,
        thumbnailPicture: TCloudinaryFile,
        images: TCloudinaryFile[],
        categoryId: string,
        name: string
    }>> 
{
    const [productRecord] = await db
        .select({ 
            isActive: products.isActive,
            thumbnailPicture: products.thumbnailPicture,
            images: products.images,
            categoryId: products.categoryId,
            name: products.name
        })
        .from(products)
        .where(and(
            eq(products.id, productId),
            eq(products.isSoftDeleted, false)
        ))
        .limit(1)

    if (!productRecord) 
        return Result.failure({
            code: STATUS_CODE.NOT_FOUND,
            description: `Product with ID: ${productId} not found.`,
            domain: DOMAIN
        })

    return Result.success({
        isActive: productRecord.isActive,
        thumbnailPicture: productRecord.thumbnailPicture,
        images: productRecord.images,
        categoryId: productRecord.categoryId,
        name: productRecord.name
    })
}

// find any order item from order that's associate with current product
async function isProductInActiveOrdersAsync(productId: string) 
    : Promise<Result<boolean>>
{
    const [isProductOnActiveOrder] = await db
        .select({ id: orderItems.id })
        .from(orderItems)
        .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(and(
            eq(orderItems.productId, productId),
            notInArray(orders.status, ['done', 'cancelled'])
        ))
        .limit(1)

    if (isProductOnActiveOrder)
        return Result.failure({
            code: STATUS_CODE.FORBIDDEN,
            description: `Cannot update this product because there are active, unconfirmed customer orders associated with it.`,
            domain: DOMAIN
        })

    return Result.success(true)
}

// find any product with same slug
async function isSlugDuplicatedAsync(productId: string, slug: string)
    : Promise<Result<boolean>>
{
    const [isDuplicated] = await db
        .select({ id: products.id, slug: products.slug })
        .from(products)
        .where(and(
            eq(products.slug, slug),
            ne(products.id, productId),
            eq(products.isSoftDeleted, false)
        ))
        .limit(1)

    if (isDuplicated) {
        return Result.failure({
            code: STATUS_CODE.DUPLICATED,
            description: `Product with slug: ${slug} is already exist.`,
            domain: DOMAIN
        })
    }

    return Result.success(true)
}

// find any product with same name from same category
async function isNameDuplicatedInCategoryAsync(productId: string, categoryId: string, name: string) 
    : Promise<Result<boolean>>
{
    const [isDuplicated] = await db
        .select({ id: products.id })
        .from(products)
        .where(and(
            ilike(products.name, name),
            eq(products.categoryId, categoryId),
            ne(products.id, productId),
            eq(products.isSoftDeleted, false)
        ))
        .limit(1)

    if (isDuplicated)
        return Result.failure({
            code: STATUS_CODE.BAD_REQUEST,
            description: `Product with name: ${name} is already exist in this category.`,
            domain: DOMAIN
        })

    return Result.success(true)
}