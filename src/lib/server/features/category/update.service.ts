import { Result } from "$lib/types/global/result.types";
import { and, eq, ne } from "drizzle-orm";
import { cleanupPreviousFileAsync, processAndUploadImageAsync } from "$lib/server/utils";
import { UpdateCategoryByIdSchema, type TUpdateCategoryByIdRequest, type TUpdateCategoryByIdResponse } from "$lib/types/features";
import { categories, db } from "$lib/server/data";
import type { TCloudinaryFile } from "$lib/types/global";
import { messages, statusCodes } from "$lib/constants";

const DOMAIN = "UpdateCategoryByIdService" as const

//--- update by id -------------------------------
export async function updateCategoryByIdAsync(data: TUpdateCategoryByIdRequest)
    : Promise<Result<TUpdateCategoryByIdResponse>> 
{
    const validation = UpdateCategoryByIdSchema.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: categoryId, data: patchData } = validation.data;

    let finalThumbnail: TCloudinaryFile | undefined = undefined
    let prevThumbnail: TCloudinaryFile | undefined = undefined

    try {
        // check is category exist and return prev thumbnail
        const existingCategory = await checkAndGetCategoryAsync(categoryId)
        if (existingCategory.isFailure) return Result.failure(existingCategory.error)
        
        // check is slug duplicated 
        if (patchData.slug !== undefined) {
            const isSlugDuplicated = await isSlugDuplicatedAsync(categoryId, patchData.slug)
            if (isSlugDuplicated.isFailure) return Result.failure(isSlugDuplicated.error)
        }

        // check is name duplicated
        if (patchData.name !== undefined) {
            const isNameDuplicated = await isNameDuplicatedAsync(categoryId, patchData.name)
            if (isNameDuplicated.isFailure) return Result.failure(isNameDuplicated.error)
        }
        
        // compress and upload image to storage
        if (patchData.thumbnailPicture !== undefined) {
            const mediaResult = await processAndUploadImageAsync(patchData.thumbnailPicture)
            if (mediaResult.isFailure) return Result.failure(mediaResult.error) 

            if (mediaResult) {
                prevThumbnail = existingCategory.value.thumbnailPicture
                finalThumbnail = mediaResult.value
            }
        }

        // save to database
        const [updatedCategory] = await db
            .update(categories)
            .set({
                ...(patchData.name !== undefined && { name: patchData.name }),
                ...(patchData.description !== undefined && { description: patchData.description }),
                ...(patchData.slug !== undefined && { slug: patchData.slug }),
                ...(finalThumbnail !== undefined && { thumbnailPicture: finalThumbnail }),
                updatedAt: new Date()
            })
            .where(eq(categories.id, categoryId))
            .returning()

        // remove prev image from storage
        await cleanupPreviousFileAsync(prevThumbnail)

        const response: TUpdateCategoryByIdResponse = {
            id: updatedCategory.id,
            slug: updatedCategory.slug
        } as const

        return Result.success(response)
    } catch (error: unknown) {
        // rollback uploaded image if save db failed
        await cleanupPreviousFileAsync(finalThumbnail)
        return Result.serverError(error, DOMAIN)
    }
}

//--- helper -------------------------------------
async function checkAndGetCategoryAsync(categoryId: string)
    : Promise<Result<{ thumbnailPicture: TCloudinaryFile }>> 
{
    const [categoryRecord] = await db
        .select({ 
            id: categories.id, 
            thumbnailPicture: categories.thumbnailPicture 
        })
        .from(categories)
        .where(and(
            eq(categories.id, categoryId),
            eq(categories.isSoftDeleted, false)
        ))
        .limit(1)

    if (!categoryRecord) 
        return Result.failure({
            code: statusCodes.NOT_FOUND,
            description: messages.NOT_FOUND("Category", categoryId),
            domain: DOMAIN
        })

    return Result.success({ thumbnailPicture: categoryRecord.thumbnailPicture })
}

async function isSlugDuplicatedAsync(categoryId: string, slug: string): Promise<Result<boolean>> {
    const [isDuplicated] = await db
        .select({ id: categories.id, slug: categories.slug })
        .from(categories)
        .where(and(
            eq(categories.slug, slug),
            ne(categories.id, categoryId)
        ))
        .limit(1)

    if (isDuplicated)
        return Result.failure({
            code: statusCodes.DUPLICATED,
            description: messages.NOT_FOUND("Category", categoryId),
            domain: DOMAIN
        })

    return Result.success(true)
}

async function isNameDuplicatedAsync(categoryId: string, name: string): Promise<Result<boolean>> {
    const [isDuplicated] = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(and(
            eq(categories.name, name),
            ne(categories.id, categoryId)
        ))
        .limit(1)

    if (isDuplicated)
        return Result.failure({
            code: statusCodes.DUPLICATED,
            description: messages.DUPLICATED("Category", "name", name),
            domain: DOMAIN
        })

    return Result.success(true)
}