import { Result } from "$lib/types/global/result.types";
import { and, eq, ilike, or } from "drizzle-orm";
import { cleanupPreviousFileAsync, findSpecificErrorValues, processAndUploadImageAsync } from "$lib/server/utils";
import { CreateCategorySchema, type TCreateCategoryRequest, type TCreateCategoryResponse } from "$lib/types/features";
import { categories, db } from "$lib/server/data";
import { messages, statusCodes, type TCloudinaryFile } from "$lib/types/global";

const DOMAIN = "CategoryService" as const

//--- create -------------------------------------
export async function createCategoryAsync(data: TCreateCategoryRequest)
    : Promise<Result<TCreateCategoryResponse>> 
{
    const validation = CreateCategorySchema.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const payload = validation.data;
    
    let finalThumbnail: TCloudinaryFile | undefined = undefined

    try {
        // check duplicate for slug and name
        const checkDuplicate = await checkDuplicateSlugOrNameAsync(payload.name, payload.slug)
        if (checkDuplicate.isFailure) return Result.failure(checkDuplicate.error)

        // compress and upload image to storage
        const thumbnailMetadata = await processAndUploadImageAsync(payload.thumbnailPicture)
        if (thumbnailMetadata.isFailure) return Result.failure(thumbnailMetadata.error) 

        finalThumbnail = thumbnailMetadata.value

        // save to database
        const [insertedCategory] = await db
            .insert(categories)
            .values({
                name: payload.name,
                description: payload.description,
                thumbnailPicture: finalThumbnail,
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
        // rollback uploaded image if save db failed
        await cleanupPreviousFileAsync(finalThumbnail)
        return Result.serverError(error, DOMAIN)
    }
}

//--- helper -------------------------------------
async function checkDuplicateSlugOrNameAsync(name: string, slug: string)
    : Promise<Result<boolean>> 
{
    const [categoryRecord] = await db
        .select({ 
            id: categories.id,
            name: categories.name , 
            slug: categories.slug,
            isSoftDeleted: categories.isSoftDeleted 
        })
        .from(categories)
        .where(and(
            or(
                ilike(categories.name, name),
                eq(categories.slug, slug)
            )
        ))
        .limit(1)
            
    if (categoryRecord) {
        if (!categoryRecord.isSoftDeleted) {
            const specificReason = findSpecificErrorValues(
                { ori: categoryRecord.name, current: name },
                { ori: categoryRecord.slug, current: slug }
            );

            return Result.failure({ 
                code: statusCodes.DUPLICATED, 
                description: messages.DUPLICATED("Category", typeof(specificReason), specificReason), 
                domain: DOMAIN 
            })
        }
    }

    return Result.success(true)
}