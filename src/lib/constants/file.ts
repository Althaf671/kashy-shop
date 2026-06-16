//--- File validation ---------------------------
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"] as string[];
export type TAcceptedImages = typeof ACCEPTED_IMAGE_TYPES[number]

//--- File converter ----------------------------
export const MAX_RESIZE_DIMENSION = 800 as const

//--- File storage ------------------------------
export const FOLDER_NAME = "Kash_Storage" as const