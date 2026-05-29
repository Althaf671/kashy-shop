import { Result } from "$lib/types/global/result.types";
import type { TGetCategoryLookupResponse } from "$lib/types/features";
import { categories, db } from "$lib/server/data";
import { eq } from "drizzle-orm";

const DOMAIN = "GetCategoryLookupListService" as const

//--- get lookup list ---------------------------------
export async function getCategoryLookupListAsync()
    : Promise<Result<TGetCategoryLookupResponse[]>> 
{
    try {
        const queryCategory = await db
            .select({
                id: categories.id,
                name: categories.name,
                description: categories.description,
                thumbnailPicture: categories.thumbnailPicture,
                slug: categories.slug
            })
            .from(categories)
            .where(eq(categories.isSoftDeleted, false))

        const response: TGetCategoryLookupResponse[] = queryCategory.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            thumbnailPicture: category.thumbnailPicture,
            slug: category.slug
        }))

        return Result.success(response)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}