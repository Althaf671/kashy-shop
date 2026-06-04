import { and, eq, ilike, or } from "drizzle-orm";
import { categories, db, products } from "$lib/server/data";
import { cleanupPreviousFileAsync, findSpecificErrorValues, processAndUploadMultiImagesAsync } from "$lib/server/utils";
import { CreateProductScheme, type TCreateProductRequest, type TCreateProductResponse } from "$lib/types/features";
import { Result, type TCloudinaryFile } from "$lib/types/global";
import { messages, statusCodes } from "$lib/constants";


//--- create -------------------------------------
const DOMAIN = "CreateProductService" as const

export async function createProductAsync(data: TCreateProductRequest)
    : Promise<Result<TCreateProductResponse>> 
{
    const validation = CreateProductScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data

    let finalThumbnail: TCloudinaryFile | undefined = undefined
    let finalImages: TCloudinaryFile[] = []

    try {
        // check is category exist
        const isCategoryExist = await isAssociateCategoryExistAsync(payload.categoryId)
        if (isCategoryExist.isFailure) return Result.failure(isCategoryExist.error)
        
        // check is slug and name in respected category duplicated
        const checkDuplicate = await checkDuplicateSlugAndNameInCategoryAsync(payload.categoryId, payload.name, payload.slug)
        if (checkDuplicate.isFailure) return Result.failure(checkDuplicate.error)
       
        // compress and upload multiple images to storage
        const multiMediaResult = await processAndUploadMultiImagesAsync(payload.thumbnailPicture, payload.images)
        if (multiMediaResult.isFailure) return Result.failure(multiMediaResult.error)

        const { thumbnailResult, imagesResult } = multiMediaResult.value

        finalThumbnail = thumbnailResult!
        finalImages = imagesResult

        // save to database
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

        const response: TCreateProductResponse = {
            id: createdProduct.id,
            slug: createdProduct.slug
        }

        return Result.success(response)
    } catch (error: unknown) {
        await cleanupPreviousFileAsync(finalThumbnail, finalImages)
        return Result.serverError(error, DOMAIN)
    }
}

//--- helper -------------------------------------
async function isAssociateCategoryExistAsync(categoryId: string) 
    : Promise<Result<boolean>>
{
    const [isCategoryExist] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(and(
            eq(categories.id, categoryId),
            eq(categories.isSoftDeleted, false)
        ))
        .limit(1)

    if (!isCategoryExist)
        return Result.failure({
            code: statusCodes.NOT_FOUND,
            description: messages.NOT_FOUND("Category", categoryId),
            domain: DOMAIN
        })

    return Result.success(true)
}

async function checkDuplicateSlugAndNameInCategoryAsync(categoryId: string, name: string, slug: string)
    : Promise<Result<boolean>>
{
    const [isDuplicated] = await db
        .select({ 
            id: products.id,
            name: products.name,
            categoryId: products.categoryId,
            slug: products.slug,
        })
        .from(products)
        .where(and(
            eq(products.isSoftDeleted, false),
            or(
                and(
                    ilike(products.name, name),
                    eq(products.categoryId, categoryId),
                ),
                eq(products.slug, slug)
            )
        ))
        .limit(1)

    if (isDuplicated) {
        const specificReason = findSpecificErrorValues(
            { ori: isDuplicated.categoryId, current: categoryId },
            { ori: isDuplicated.name, current: name },
            { ori: isDuplicated.slug, current: slug },
        )

        return Result.failure({
            code: statusCodes.DUPLICATED,
            description: messages.DUPLICATED("Slug or Name", "value", specificReason),
            domain: DOMAIN
        })
    }

    return Result.success(true)
}