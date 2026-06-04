import { ACCEPTED_IMAGE_TYPES, KASH, type TAcceptedImages } from "$lib/constants";
import { PRODUCTS_CONSTRAINT } from "$lib/server/data";
import { size } from "$lib/server/utils/general/size";
import { PRODUCT_TYPE, type TCloudinaryFile, type TProductType } from "$lib/types/global/shared.types";
import { z } from "zod";

//--- create -------------------------------------
export const CreateProductScheme = z.object({
    name: z
        .string()
        .trim()
        .min(5, { error: `Minimum 5 characters, ${KASH}.`})
        .max(PRODUCTS_CONSTRAINT.nameLength, `Maximum ${PRODUCTS_CONSTRAINT.nameLength} characters, ${KASH}.`),
    description: z
        .string()
        .min(5, { error: `Minimum 5 characters, ${KASH}.`})
        .max(PRODUCTS_CONSTRAINT.descriptionLength, `Maximum ${PRODUCTS_CONSTRAINT.descriptionLength} characters, ${KASH}.`),
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
        .max(PRODUCTS_CONSTRAINT.slugLength, `Maximum ${PRODUCTS_CONSTRAINT.slugLength} characters, ${KASH}.`),
    price: z
        .coerce.number()
        .min(PRODUCTS_CONSTRAINT.priceRange.min, 
            { error: `You can not input any number below ${PRODUCTS_CONSTRAINT.priceRange.min}, ${KASH}.`})
        .max(PRODUCTS_CONSTRAINT.priceRange.max, 
            { error: `You can not input stock value above ${PRODUCTS_CONSTRAINT.priceRange.max}, ${KASH}.`}),
    stock: z
        .coerce.number()
        .min(PRODUCTS_CONSTRAINT.stockRange.min, 
            { error: `You can not input any number below ${PRODUCTS_CONSTRAINT.stockRange.min}, ${KASH}.`})
        .max(PRODUCTS_CONSTRAINT.stockRange.max, 
            { error: `You can not input stock value above ${PRODUCTS_CONSTRAINT.stockRange.max}, ${KASH}.`}),
    type: z.enum(PRODUCT_TYPE),
    images: z
        .array(z.instanceof(File))
        .min(1, { message: `Must input atleast 1 file, ${KASH}.` })
        .max(5, { message: `Maximum file input is 5, ${KASH}.` })
        .refine((files) => 
            files.every((file) => file.size <= size.inMB(2), `Maximum file size is 2MB, ${KASH}.`))
        .refine((files) => 
            files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type as TAcceptedImages), `File format is must between JPG, JPEG, or WEBP, ${KASH}.`)),
    isActive: z.boolean("You did not input a parameter with type of boolean.").default(true),
    categoryId: z.uuid("You did not input a valid UUID."), 
})
export type TCreateProductRequest = z.infer<typeof CreateProductScheme>
export type TCreateProductResponse = { id: string; slug: string; } 

//--- update by id -------------------------------
export const UpdateProductByIdScheme = z.object({
    id: z.uuid("You did not input a valid UUID."), 
    data: CreateProductScheme.partial()
})
export type TUpdateProductByIdRequest = z.infer<typeof UpdateProductByIdScheme>
export type TUpdateProductByIdResponse = TCreateProductResponse

//--- delete by id -------------------------------
export const DeleteProductByIdScheme = z.object({ id: z.uuid("You did not input a valid UUID.")})
export type TDeleteProductByIdRequest = z.infer<typeof DeleteProductByIdScheme>

//--- get by id ----------------------------------
export const GetProductByIdScheme = z.object({ id: z.uuid("You did not input a valid UUID.")})
export type TGetProductByIdRequest = z.infer<typeof GetProductByIdScheme>
export type TGetProductByIdResponse = {
    id: string;
    name: string;
    description: string;
    thumbnailPicture: TCloudinaryFile;
    slug: string;
    price: number;
    stock: number;
    type: TProductType;
    images: TCloudinaryFile[];
    isActive: boolean;
    updatedAt: Date | null;
    createdAt: Date | null;
    categoryParent: {
        id: string;
        name: string | null;
    }
}

//--- get lookup ---------------------------------
export type TGetProductLookupResponse = Omit<TGetProductByIdResponse, 'updatedAt' | 'createdAt'>