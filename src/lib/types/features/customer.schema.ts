import { CUSTOMERS_CONSTRAINT } from "$lib/server/data";
import { KASH } from "$lib/types/global/constant.types";
import { z } from "zod";

//--- create -------------------------------------
export const CreateCustomerScheme = z.object({
    name: z
        .string()
        .trim()
        .min(5, { error: `Minimum 5 characters, ${KASH}.`})
        .max(CUSTOMERS_CONSTRAINT.nameLength, `Maximum ${CUSTOMERS_CONSTRAINT.nameLength} characters, ${KASH}.`),
    phone: z.e164(`Please input a valid phone number, ${KASH}. (eg: +628xxx)`).trim(),
    instagramUrl: z.url({ hostname: /^instagram\.com$/ }).trim().optional()
})
export type TCreateCustomerRequest = z.infer<typeof CreateCustomerScheme>
export type TCreateCustomerResponse = { id: string, name: string }

//--- update by id -------------------------------
export const UpdateCustomerByIdScheme = z.object({ 
    id: z.uuid("You did not input a valid UUID."),
    data: CreateCustomerScheme.partial()
})
export type TUpdateCustomerByIdRequest = z.infer<typeof UpdateCustomerByIdScheme>
export type TUpdateCustomerByIdResponse = TCreateCustomerResponse

//--- get by id ----------------------------------
export const GetCustomerByIdScheme = z.object({ id: z.uuid("You did not input a valid UUID.")})
export type TGetCustomerByIdRequest = z.infer<typeof GetCustomerByIdScheme>
export type TGetCustomerByIdResponse = {
    id: string;
    name: string;
    phone: string;
    instagramUrl: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}

//--- get lookup ---------------------------------
export type TGetCustomerLookupResponse = Omit<TGetCustomerByIdResponse, 'updatedAt' | 'createdAt'>;