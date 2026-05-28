import { eq } from "drizzle-orm";
import { Result } from "$lib/types/global/result.types";
import { STATUS_CODE } from "$lib/types/global/constant.types";
import { deleteFileByPublicIdAsync } from "$lib/server/utils/file-upload";
import { DeleteCategoryByIdSchema, type TDeleteCategoryByIdRequest } from "$lib/types/features";
import { categories, db } from "$lib/server/data";

const DOMAIN = "DeleteCategoryByIdService" as const

//--- delete by id -------------------------------
export async function deleteCategoryByIdAsync(data: TDeleteCategoryByIdRequest)
    : Promise<Result<string>> 
{
    const validation = DeleteCategoryByIdSchema.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: categoryId } = validation.data;
    let imagePublicId: string
    
    try {
        const [existingCategory] = await db
            .select({ id: categories.id, thumbnailPicture: categories.thumbnailPicture })
            .from(categories)
            .where(eq(categories.id, categoryId))
            .limit(1)
        if (!existingCategory) 
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })


        imagePublicId = existingCategory.thumbnailPicture.publicId

        const [deletedCategory] = await db
            .delete(categories)
            .where(eq(categories.id, categoryId))
            .returning({ id: categories.id })
        if (!deletedCategory) 
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })

        if (imagePublicId) 
            await deleteFileByPublicIdAsync(imagePublicId).catch((error) => {
                console.warn("[WARNING]: Failed to delete previous image", error)
            })
        
        return Result.success(`Success deleting category with ID: ${categoryId}.`)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}