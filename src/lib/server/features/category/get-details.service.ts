import { and, eq } from "drizzle-orm";
import { Result } from "$lib/types/global/result.types";
import { GetCategoryByIdSchema, type TGetCategoryByIdRequest, type TGetCategoryByIdResponse } from "$lib/types/features";
import { categories, db } from "$lib/server/data";
import { statusCodes } from "$lib/constants";

const DOMAIN = "GetCategoryByIdService" as const

//--- get by id ----------------------------------
export async function getCategorybyIdAsync(data: TGetCategoryByIdRequest)
    : Promise<Result<TGetCategoryByIdResponse>> 
{
    const validation = GetCategoryByIdSchema.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const { id: categoryId } = validation.data;

    try {
        const [queryCategory] = await db
            .select({
                id: categories.id,
                name: categories.name,
                description: categories.description,
                thumbnailPicture: categories.thumbnailPicture,
                slug: categories.slug,
                updatedAt: categories.updatedAt,
                createdAt: categories.createdAt
            })
            .from(categories)
            .where(and(
                eq(categories.id, categoryId),
                eq(categories.isSoftDeleted, false)
            ))
             
        if (!queryCategory) 
            return Result.failure({
                code: statusCodes.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })

        const response: TGetCategoryByIdResponse = {
            id: queryCategory.id,
            name: queryCategory.name,
            description: queryCategory.description,
            thumbnailPicture: queryCategory.thumbnailPicture,
            slug: queryCategory.slug,
            updatedAt: queryCategory.updatedAt,
            createdAt: queryCategory.createdAt
        }

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}