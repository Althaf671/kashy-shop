import { Result } from "$lib/types/global/result.types";
import { and, eq, ilike, or } from "drizzle-orm";
import { KASH, STATUS_CODE } from "$lib/types/global/constant.types";
import { findSpecificErrorValues, processAndUploadThumbnailAsync } from "$lib/server/utils";
import { CreateCategorySchema, type TCreateCategoryRequest, type TCreateCategoryResponse } from "$lib/types/features";
import { categories, db } from "$lib/server/data";

const DOMAIN = "CategoryService" as const

//--- create -------------------------------------
export async function createCategoryAsync(data: TCreateCategoryRequest)
    : Promise<Result<TCreateCategoryResponse>> 
{
    const validation = CreateCategorySchema.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data;
    
    try {
        const [isExist] = await db
            .select({ 
                id: categories.id,
                name: categories.name , 
                slug: categories.slug,
                isSoftDeleted: categories.isSoftDeleted 
            })
            .from(categories)
            .where(and(
                or(
                    ilike(categories.name, payload.name),
                    eq(categories.slug, payload.slug)
                )
            ))
            .limit(1)
            
        if (isExist) {
            if (!isExist.isSoftDeleted) {
                const specificReason = findSpecificErrorValues(
                    { ori: isExist.name, current: payload.name },
                    { ori: isExist.slug, current: payload.slug }
                );
                const errMsg = `Category with ${specificReason} already exists, ${KASH}.`

                return Result.failure({ 
                    code: STATUS_CODE.DUPLICATED, 
                    description: errMsg, 
                    domain: DOMAIN 
                })
            }

            const thumbnailMetadata = await processAndUploadThumbnailAsync(payload.thumbnailPicture)
            if (thumbnailMetadata.isFailure) return Result.failure(thumbnailMetadata.error) 

            const [restoredCategory] = await db
                .update(categories)
                .set({
                    name: payload.name,
                    description: payload.description,
                    thumbnailPicture: {
                        publicId: thumbnailMetadata.value.publicId,
                        imageUrl: thumbnailMetadata.value.imageUrl
                    },
                    isSoftDeleted: false,
                    updatedAt: new Date()
                })
                .where(eq(categories.id, isExist.id))
                .returning()

            const response: TCreateCategoryResponse = {
                id: restoredCategory.id,
                slug: restoredCategory.slug
            } as const

            return Result.success(response)
        }

        const thumbnailMetadata = await processAndUploadThumbnailAsync(payload.thumbnailPicture)
        if (thumbnailMetadata.isFailure) return Result.failure(thumbnailMetadata.error) 

        const [insertedCategory] = await db
            .insert(categories)
            .values({
                name: payload.name,
                description: payload.description,
                thumbnailPicture: { 
                    publicId: thumbnailMetadata.value.publicId, 
                    imageUrl: thumbnailMetadata.value.imageUrl
                },
                slug: payload.slug,
                updatedAt: undefined,
            })
            .returning()
        
        const response: TCreateCategoryResponse = {
            id: insertedCategory.id,
            slug: insertedCategory.slug
        } as const

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}