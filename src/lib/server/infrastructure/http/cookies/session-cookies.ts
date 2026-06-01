import { COOKIE_CONSTRAINT, COOKIE_NAME } from "$lib/server/config/cookie";
import type { RequestEvent } from "@sveltejs/kit";

// create session cookie
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set(COOKIE_NAME.SESSION, token, {
        httpOnly: COOKIE_CONSTRAINT.SESSION.isHttpOnly,
        path: COOKIE_CONSTRAINT.SESSION.path,
        secure: COOKIE_CONSTRAINT.SESSION.isSecure,
        sameSite: COOKIE_CONSTRAINT.SESSION.sameSite,
        expires: expiresAt
    })
}

// remove session cookie
export function removeSessionTokenCookie(event: RequestEvent): void {
    event.cookies.delete(COOKIE_NAME.SESSION, {
        path: COOKIE_CONSTRAINT.SESSION.path
    })
}