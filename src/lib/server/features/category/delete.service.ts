import { and, eq, sql } from "drizzle-orm";
import { Result } from "$lib/types/global/result.types";
import { STATUS_CODE } from "$lib/types/global/constant.types";
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
    
    try {
        const now = Date.now().toString()

        const [deletedCategory] = await db
            .update(categories)
            .set({ 
                name: sql`${categories.name} || '-deleted-' || ${now}`,
                slug: sql`${categories.slug} || '-deleted-' || ${now}`,
                isSoftDeleted: true
            })
            .where(and(
                eq(categories.id, categoryId),
                eq(categories.isSoftDeleted, false)
            ))
            .returning({ id: categories.id})

        if (!deletedCategory) 
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })
        
        return Result.success(`Success deleting category with ID: ${categoryId}.`)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}