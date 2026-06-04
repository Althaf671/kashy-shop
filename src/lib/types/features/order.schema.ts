import { ACCEPTED_IMAGE_TYPES } from "$lib/constants";
import { CUSTOMERS_CONSTRAINT, ORDER_CONSTRAINT, ORDERITEMS_CONSTRAINT } from "$lib/server/data";
import { size } from "$lib/server/utils/general/size";
import { ORDER_STATUS, PAYMENT_METHOD, type TCloudinaryFile, type TOrderStatus, type TPaymentMethod } from "$lib/types/global/shared.types";
import { z } from "zod";

// ORDER ITEMS
//--- create -------------------------------------
export const CreateOrderItemsScheme = z.object({
    productName: z  
        .string()
        .trim()
        .min(5, { error: `Minimum 5 characters.`})
        .max(ORDERITEMS_CONSTRAINT.productNameLength, `Maximum ${ORDERITEMS_CONSTRAINT.productNameLength} characters.`),
    quantity: z
        .int()
        .min(ORDERITEMS_CONSTRAINT.quantityRange.min, 
            { error: `You can not input any number below ${ORDERITEMS_CONSTRAINT.quantityRange.min}.`})
        .max(ORDERITEMS_CONSTRAINT.quantityRange.max, 
            { error: `You can not input quantity value above ${ORDERITEMS_CONSTRAINT.quantityRange.max}.`}),
    priceSnapshot: z
        .int()
        .min(ORDERITEMS_CONSTRAINT.priceSnapShot.min, 
            { error: `You can not input any number below ${ORDERITEMS_CONSTRAINT.priceSnapShot.min}.`})
        .max(ORDERITEMS_CONSTRAINT.priceSnapShot.max, 
            { error: `You can not input price snapshot above ${ORDERITEMS_CONSTRAINT.priceSnapShot.max}.`}),
    productId: z.uuid("You did not input a valid UUID."),
    orderId: z.uuid("You did not input a valid UUID.")
})
export type TCreateOrderItemsRequest = z.infer<typeof CreateOrderItemsScheme>

// ORDER 
//--- create -------------------------------------
export const CreateOrderScheme = z.object({
    totalPrice: z
        .int()
        .min(ORDER_CONSTRAINT.totalPriceRange.min, 
            { error: `You can not input any number below ${ORDER_CONSTRAINT.totalPriceRange.min}.`})
        .max(ORDER_CONSTRAINT.totalPriceRange.max, 
            { error: `You can not input total price above ${ORDER_CONSTRAINT.totalPriceRange.max}.`}),
    note: z
        .string()
        .trim()
        .min(5, { error: `Minimum 5 characters.`})
        .max(ORDER_CONSTRAINT.noteLength, `Maximum ${ORDER_CONSTRAINT.noteLength} characters.`)
        .optional(),
    items: z.array(CreateOrderItemsScheme).min(1, "Atleast choose one product.")
})
export type TCreateOrderRequest = z.infer<typeof CreateOrderScheme>
export type TCreateOrderResponse = { 
    id: string; 
    orderCode: string; 
    status: TOrderStatus;
}

//--- attach to id and phone -----------------------
export const AttachCustomerToOrderScheme = z.object({
    orderId: z.uuid("You did not input a valid UUID."),
    phone: z.e164(`Please input a valid phone number. (eg: +628xxx)`).trim(),
    name: z
        .string()
        .trim()
        .min(5, { error: `Minimum 5 characters.`})
        .max(CUSTOMERS_CONSTRAINT.nameLength, `Maximum ${CUSTOMERS_CONSTRAINT.nameLength} characters.`)
        .optional(),
    instagramUrl: z.url({ hostname: /^instagram\.com$/ }).trim().optional()
})

//--- pay by id ------------------------------------
export const PayOrderScheme = z.object({
    orderId: z.uuid("You did not input a valid UUID."),
    paymentMethod: z.enum(PAYMENT_METHOD),
    paymentProof: z
        .file()
        .max(size.inMB(2), `Maximum file size is 2MB.`)
        .mime(ACCEPTED_IMAGE_TYPES, `File format is must between JPG, JPEG, or WEBP.`)
        .optional(),
})
export type TPayOrderResponse = {
    id: string;
    orderCode: string;
    status: TOrderStatus;
    paymentMethod: TPaymentMethod;
}

//--- update by id ---------------------------------
export const UpdateOrderByIdScheme = z.object({
    id: z.uuid("You did not input a valid UUID."),
    adminNote: z
        .string()
        .trim()
        .min(5, { error: `Minimum 5 characters.`})
        .max(ORDER_CONSTRAINT.adminNoteLength, `Maximum ${ORDER_CONSTRAINT.adminNoteLength} characters.`)
        .optional(),
    status: z.enum(ORDER_STATUS),
})
export type TUpdateOrderByIdRequest = z.infer<typeof UpdateOrderByIdScheme>
export type TUpdateorderByIdResponse = {
    id: string;
    orderCode: string;
    status: TOrderStatus;
    adminNote: string | null;
}

//--- get by id ----------------------------------
export type TProductRecord = {
    id: string;
    name: string;
    stock: number;
    price: number;
}

export const GetOrderByIdScheme = z.object({ id: z.uuid("You did not input a valid UUID.")})
export type TGetOrderByIdRequest = z.infer<typeof GetOrderByIdScheme>
export type TGetOrderByIdResponse = {
    id: string;
    orderCode: string;
    status: TOrderStatus;
    totalPrice: number;
    paymentMethod: TPaymentMethod;
    paymentProof: TCloudinaryFile;
    note: string;
    adminNote: string;
    updatedAt: Date;
    createdAt: Date;
    customerParent: {
        id: string;
        name: string;
    }
}

//--- get lookup ---------------------------------
export type TGetOrderLookupResponse = Omit<TGetOrderByIdResponse, 
    'updatedAt' | 'createdAt' | 'note' | 'adminNote' | 'paymentProof'>