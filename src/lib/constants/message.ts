//--- Kashley -----------------------------------
export const KASH = "Kash" as const;

//--- Messages ----------------------------------
export const messages = {
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
    },
    TO_MANY_REQUEST(minutes: number): string { 
        return `Slow down, You are attempting to many request, try again within ${minutes} minutes.`
    }
} as const