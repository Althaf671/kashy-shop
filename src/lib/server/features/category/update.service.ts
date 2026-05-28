import { Result } from "$lib/types/global/result.types";
import { and, eq, ilike, ne, or } from "drizzle-orm";
import { KASH, STATUS_CODE } from "$lib/types/global/constant.types";
import { deleteFileByPublicIdAsync, findSpecificErrorValues, processAndUploadThumbnailAsync } from "$lib/server/utils";
import { UpdateCategoryByIdSchema, type TUpdateCategoryByIdRequest, type TUpdateCategoryByIdResponse } from "$lib/types/features";
import type { TCloudinaryImage } from "$lib/types/global";
import { categories, db } from "$lib/server/data";

const DOMAIN = "UpdateCategoryByIdService" as const

//--- update by id -------------------------------
export async function updateCategoryByIdAsync(data: TUpdateCategoryByIdRequest)
    : Promise<Result<TUpdateCategoryByIdResponse>> 
{
    const validation = UpdateCategoryByIdSchema.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    // temp var for rollback
    let prevThumbnail: TCloudinaryImage 
    let thumbnailMetadata: TCloudinaryImage | undefined = undefined
    const { id: categoryId, data: patchData } = validation.data;

    try {
        const [existingCategory] = await db
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

        if (!existingCategory) 
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })

        // assign prev thumbnail
        prevThumbnail = existingCategory.thumbnailPicture

        if (patchData.name !== undefined || patchData.slug !== undefined) {
            const orConditions =[]
            if (patchData.name !== undefined) orConditions.push(ilike(categories.name, patchData.name))
            if (patchData.slug !== undefined) orConditions.push(eq(categories.slug, patchData.slug))

            const [isDuplicated] = await db
                .select({ id: categories.id, name: categories.name, slug: categories.slug })
                .from(categories)
                .where(
                    and(
                        or(...orConditions),
                        ne(categories.id, categoryId),
                        eq(categories.isSoftDeleted, false)
                    )
                )
                .limit(1)

            if (isDuplicated) {
                const specificReason = findSpecificErrorValues(
                    { ori: isDuplicated.name, current: patchData.name },
                    { ori: isDuplicated.slug, current: patchData.slug }
                );
                const errMsg = `Category with ${specificReason} already exists, ${KASH}.`;
                
                return Result.failure({
                    code: STATUS_CODE.DUPLICATED,
                    description: errMsg,
                    domain: DOMAIN
                })
            }
        }
        
        if (patchData.thumbnailPicture !== undefined) {
            const metadata = await processAndUploadThumbnailAsync(patchData.thumbnailPicture)
            if (metadata.isFailure) return Result.failure(metadata.error) 
            thumbnailMetadata = metadata.value
        }

        const [updatedCategory] = await db
            .update(categories)
            .set({
                ...(patchData.name !== undefined && { name: patchData.name }),
                ...(patchData.description !== undefined && { description: patchData.description }),
                ...(patchData.slug !== undefined && { slug: patchData.slug }),
                ...(thumbnailMetadata !== undefined && {
                    thumbnailPicture: {
                        publicId: thumbnailMetadata.publicId,
                        imageUrl: thumbnailMetadata.imageUrl
                    }
                }),
                updatedAt: new Date()
            })
            .where(eq(categories.id, categoryId))
            .returning()

        if (!updatedCategory) {
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })
        }

        if (prevThumbnail && thumbnailMetadata !== undefined) 
            await deleteFileByPublicIdAsync(prevThumbnail.publicId).catch((error) => {
                console.warn("[WARNING]: Failed to delete previous image", error)
            })

        const response: TUpdateCategoryByIdResponse = {
            id: updatedCategory.id,
            slug: updatedCategory.slug
        } as const

        return Result.success(response)
    } catch (error: unknown) {
        if (thumbnailMetadata) 
            await deleteFileByPublicIdAsync(thumbnailMetadata.publicId).catch((error) => {
                console.warn("[WARNING]: Failed to delete previous image", error)
            })

        return Result.serverError(error, DOMAIN)
    }
}