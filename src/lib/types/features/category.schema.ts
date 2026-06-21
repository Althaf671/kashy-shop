import { z } from "zod";
import type { TCloudinaryFile } from "../global";
import { CATEGORIES_CONSTRAINT } from "$lib/server/data";
import { ACCEPTED_IMAGE_TYPES, KASH } from "$lib/constants";
import { size } from "$lib/server/utils/general/size";

//--- create -------------------------------------
export const CreateCategorySchema = z.object({
    name: z
        .string({ error: `Name can't be empty ${KASH}.` })
        .trim()
        .min(5, { error: `Minimum 5 characters, ${KASH}.`})
        .max(CATEGORIES_CONSTRAINT.nameLength, `Maximum ${CATEGORIES_CONSTRAINT.nameLength} characters, ${KASH}.`),
    description: z
        .string()
        .trim()
        .min(5, { error: `Minimum 5 characters, ${KASH}.`})
        .max(CATEGORIES_CONSTRAINT.descriptionLength, `Maximum ${CATEGORIES_CONSTRAINT.descriptionLength} characters, ${KASH}.`),
    thumbnailPicture: z
        .file()
        .max(size.inMB(2), `Maximum file size is 2MB, ${KASH}.`)
        .mime(ACCEPTED_IMAGE_TYPES, `File format is must between JPG, JPEG, or WEBP, ${KASH}.`),
    slug: z
        .string()
        .trim()
        .refine((val) => val.includes("-"), { message: `Slug must contains character '-', ${KASH}.` })
        .refine((val) => !val.includes(" "), { message: `Slug can't contains space, ${KASH}.` })
        .min(5, { error: `Minimum 5 characters, ${KASH}.`})
        .max(CATEGORIES_CONSTRAINT.slugLength,`Maximum ${CATEGORIES_CONSTRAINT.slugLength} characters, ${KASH}.`),
})
export type TCreateCategoryRequest = z.infer<typeof CreateCategorySchema>
export type TCreateCategoryResponse = { id: string; slug: string; message: string; }

//--- update by id -------------------------------
export const UpdateCategoryByIdSchema = z.object({ 
    id: z.uuid("You did not input a valid UUID."), 
    data: CreateCategorySchema.partial()
})
export type TUpdateCategoryByIdRequest = z.infer<typeof UpdateCategoryByIdSchema>
export type TUpdateCategoryByIdResponse = TCreateCategoryResponse

//--- delete by id -------------------------------
export const DeleteCategoryByIdSchema = z.object({ id: z.uuid("You did not input a valid UUID.")})
export type TDeleteCategoryByIdRequest = z.infer<typeof DeleteCategoryByIdSchema>

//--- get by id ----------------------------------
export const GetCategoryByIdSchema = z.object({ id: z.uuid("You did not input a valid UUID.")})
export type TGetCategoryByIdRequest = z.infer<typeof GetCategoryByIdSchema>
export type TGetCategoryByIdResponse = {
    id: string;
    name: string;
    description: string;
    thumbnailPicture: TCloudinaryFile;
    slug: string;
    updatedAt: Date | null;
    createdAt: Date | null;
}

//--- get lookup ---------------------------------
export type TGetCategoryLookupResponse = Omit<TGetCategoryByIdResponse, 'updatedAt' | 'createdAt'>