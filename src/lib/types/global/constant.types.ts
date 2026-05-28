//--- Kashley -----------------------------------
export const KASH = "Kash" as const;

//--- File validation ---------------------------
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/webp"] as string[];
export type TAcceptedImages = typeof ACCEPTED_IMAGE_TYPES[number]

//--- File converter ----------------------------
export const MAX_RESIZE_DIMENSION = 800 as const

//--- File storage ------------------------------
export const FOLDER_NAME = "Kash_Storage" as const

//--- Status Code -------------------------------
export const STATUS_CODE = {
    SERVER_ERROR: "SERVER_ERROR",
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    DUPLICATED: "DUPLICATED"
} as const