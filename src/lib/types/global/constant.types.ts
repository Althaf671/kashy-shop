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
    DUPLICATED: "DUPLICATED",
    BAD_REQUEST: "BAD_REQUEST",
    FORBIDDEN: "FORBIDDEN",
    SUCCESS: "SUCCESS"
} as const

//--- Messages ----------------------------------
export const MESSAGES = {
    /** @returns `${entity} with ID: ${itemId} not found.` 
     * or @returns `${entity} not found.` 
     */
    NOT_FOUND(entity: string, itemId?: string): string {
        return itemId ? `${entity} with ID: ${itemId} not found, ${KASH}.` : `${entity} not found.`
    },
    /** @returns `${entity} with ${itemInput}: ${itemInputValue} is already exist.` */
    DUPLICATED(entity: string, itemInput: string, itemInputValue: string): string {
        return `${entity} with ${itemInput}: ${itemInputValue} is already exist, ${KASH}.` 
    },
    /** @returns `Invalid ${entity}: ${detailOrComparison}.`
     * or @returns `${entity} ${current} cannot be ${comparison} than ${limit}.`
     */
    BAD_REQUEST(
        entity: string, 
        detailOrComparison: string | { current: string, limit: string, comparison: string }
    ): string {
        if (typeof detailOrComparison === 'string') {
            return `Invalid ${entity}: ${detailOrComparison}.`
        }

        const { current, limit, comparison } = detailOrComparison;
        return `${entity} ${current} cannot be ${comparison} than ${limit}.`
    }
} as const