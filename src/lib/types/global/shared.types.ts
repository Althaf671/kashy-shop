//--- order status -------------------------------
export const ORDER_STATUS = [
    'pending', 'confirmed', 'paid', 'processing', 'done', 'cancelled' 
] as const;

export type TOrderStatus = typeof ORDER_STATUS[number]

//--- product type -------------------------------
export const PRODUCT_TYPE = [
    'pre_order', 'ready_stock'
] as const;

export type TProductType = typeof PRODUCT_TYPE[number]

//--- payment method -----------------------------
export const PAYMENT_METHOD = [
    'qris', 'transfer', 'cash'
] as const;

export type TPaymentMethod = typeof PAYMENT_METHOD[number]

//-- Cloudinary -----------------------------------
export type TCloudinaryImage = {
    publicId: string;
    imageUrl: string;
}