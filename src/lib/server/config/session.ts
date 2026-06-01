import { time } from "../utils/general/time";

//--- Session Policies -----------------------------
export const SESSION_DURATION_DAYS = time.inDays(15)
export const SLIDING_DURATION_WINDOW = time.inDays(3)

/**
 * @returns `new Date(time.now() + SESSION_DURATION_DAYS)`
 */
export function getNewSessionExpirationDate(): Date {
    return new Date(time.now() + SESSION_DURATION_DAYS)
}