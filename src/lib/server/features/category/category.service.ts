import { Result } from "$lib/global/shared.types";
import { db } from "$lib/server/db/db";
import { categories } from "$lib/server/db/schema";
import type { TCloudinaryImage } from "$lib/server/db/schema.constraints";
import { convertToWebpAsync } from "$lib/server/utils/file-converter";
import { deleteFileByPublicIdAsync, uploadFileAsync } from "$lib/server/utils/file-upload";
import { eq } from "drizzle-orm";
import { 
    CreateCategorySchema,
    DeleteCategoryByIdSchema,
    GetCategoryByIdSchema,
    UpdateCategoryByIdSchema,
    type TCreateCategoryRequest, 
    type TCreateCategoryResponse, 
    type TDeleteCategoryByIdRequest, 
    type TGetCategoryByIdRequest, 
    type TGetCategoryByIdResponse, 
    type TGetCategoryLookupResponse, 
    type TUpdateCategoryByIdRequest, 
    type TUpdateCategoryByIdResponse 
} from "./category.schema";
import { STATUS_CODE } from "$lib/global/constant.type";

const DOMAIN = "CategoryService" as const

//--- create -------------------------------------
export async function createCategoryAsync(data: TCreateCategoryRequest)
    : Promise<Result<TCreateCategoryResponse>> 
{
    // input validation
    const validation = CreateCategorySchema.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        const validData = validation.data;

        // convert to webp
        const webpThumbnail = await convertToWebpAsync(validData.thumbnailPicture)
        if (webpThumbnail.isFailure) {
            return Result.failure(webpThumbnail.error)
        }

        // upload thumbnail to storage
        const thumbnailMetadata = await uploadFileAsync(webpThumbnail.value)
        if (thumbnailMetadata.isFailure) {
            return Result.failure(thumbnailMetadata.error)
        }

        // create and save to db
        const [insertedCategory] = await db
            .insert(categories)
            .values({
                name: validData.name,
                description: validData.description,
                thumbnailPicture: { 
                    publicId: thumbnailMetadata.value.publicId, 
                    imageUrl: thumbnailMetadata.value.imageUrl
                },
                slug: validData.slug,
                createdAt: new Date()
            })
            .returning()
        
        // create response 
        const response: TCreateCategoryResponse = {
            id: insertedCategory.id,
            slug: insertedCategory.slug
        } as const

        return Result.success(response)
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- update by id -------------------------------
export async function updateCategoryByIdAsync(data: TUpdateCategoryByIdRequest)
    : Promise<Result<TUpdateCategoryByIdResponse>> 
{
    // input validation
    const validation = UpdateCategoryByIdSchema.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        const { id: categoryId, data: patchData } = validation.data;

        let thumbnailMetadata: TCloudinaryImage | undefined = undefined
        
        if (patchData.thumbnailPicture !== undefined) {
            // convert to webp
            const webpThumbnail = await convertToWebpAsync(patchData.thumbnailPicture!)
            if (webpThumbnail.isFailure) {
                return Result.failure(webpThumbnail.error)
            }

            // upload thumbnail to storage
            const metadata = await uploadFileAsync(webpThumbnail.value)
            if (metadata.isFailure) {
                return Result.failure(metadata.error)
            }

            thumbnailMetadata = metadata.value
        }

        // update and save to db
        const [updatedCategory] = await db
            .update(categories)
            .set({
                ...(patchData.name !== undefined && { name: patchData.name }),
                ...(patchData.description !== undefined && { description: patchData.description }),
                ...(patchData.slug !== undefined && { slug: patchData.slug }),
                ...(thumbnailMetadata !== undefined && {
                    thumbnailPicture: {
                        publicId: thumbnailMetadata?.publicId,
                        imageUrl: thumbnailMetadata?.imageUrl
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

        // create response
        const response: TUpdateCategoryByIdResponse = {
            id: updatedCategory.id,
            slug: updatedCategory.slug
        } as const

        return Result.success(response)
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- delete by id -------------------------------
export async function deleteCategoryByIdAsync(data: TDeleteCategoryByIdRequest)
    : Promise<Result<string>> 
{
    // input validation
    const validation = DeleteCategoryByIdSchema.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        const { id: categoryId } = validation.data;

        // check if exist
        const [existingCategory] = await db
            .select({
                id: categories.id,
                thumbnailPicture: categories.thumbnailPicture
            })
            .from(categories)
            .where(eq(categories.id, categoryId))
        if (!existingCategory) {
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })
        }

        // delete image from storage
        const imagePublicId = existingCategory.thumbnailPicture.publicId
        if (imagePublicId) {
            const result = await deleteFileByPublicIdAsync(imagePublicId)
            if (result.isFailure) {
                return Result.failure(result.error)
            }
        }

        // delete from db
        const [deletedCategory] = await db
            .delete(categories)
            .where(eq(categories.id, categoryId))
            .returning({ id: categories.id })
        if (!deletedCategory) {
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })
        }

        // create response
        const response: string = `Success deleting category with ID: ${categoryId}.` as const

        return Result.success(response)
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- get by id ----------------------------------
export async function getCategorybyIdAsync(data: TGetCategoryByIdRequest)
    : Promise<Result<TGetCategoryByIdResponse>> 
{
    // input validation
    const validation = GetCategoryByIdSchema.safeParse(data)
    if (!validation.success) {
        const errMessage = validation.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');

        return Result.failure({
            code: STATUS_CODE.VALIDATION_ERROR,
            description: errMessage,
            domain: DOMAIN
        })
    }

    try {
        const { id: categoryId } = validation.data;

        // query to db
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
            .where(eq(categories.id, categoryId))
        if (!queryCategory) {
            return Result.failure({
                code: STATUS_CODE.NOT_FOUND,
                description: `Category with ID: ${categoryId} not found.`,
                domain: DOMAIN
            })
        }

        // create response
        const response: TGetCategoryByIdResponse = {
            id: queryCategory.id,
            name: queryCategory.name,
            description: queryCategory.description,
            thumbnailPicture: queryCategory.thumbnailPicture,
            slug: queryCategory.slug,
            updatedAt: queryCategory.updatedAt,
            createdAt: queryCategory.createdAt      
        } as const

        return Result.success(response)
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}

//--- get lookup list ---------------------------------
export async function getCategoryLookupListAsync()
    : Promise<Result<TGetCategoryLookupResponse[]>> 
{
    try {
        // query to db
        const queryCategory = await db
            .select({
                id: categories.id,
                name: categories.name,
                description: categories.description,
                thumbnailPicture: categories.thumbnailPicture,
                slug: categories.slug
            })
            .from(categories)

        // map to response
        const response: TGetCategoryLookupResponse[] = queryCategory.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            thumbnailPicture: category.thumbnailPicture,
            slug: category.slug
        }))

        return Result.success(response)
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: STATUS_CODE.SERVER_ERROR,
            description: err.message,
            domain: DOMAIN
        })
    }
}