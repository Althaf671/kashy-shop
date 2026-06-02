import { COOKIE_CONSTRAINT, COOKIE_NAME } from "$lib/server/config/cookie";
import { time } from "$lib/server/utils/general/time";
import type { RequestEvent } from "@sveltejs/kit";

// create oauth state
export function setGoogleOAuthStateCookie(event: RequestEvent, state: string) {
    event.cookies.set(COOKIE_NAME.GOOGLE_OAUTH_STATE, state, {
        httpOnly: COOKIE_CONSTRAINT.GOOGLE_OAUTH_STATE.isHttpOnly,
        path: COOKIE_CONSTRAINT.GOOGLE_OAUTH_STATE.path,
        secure: COOKIE_CONSTRAINT.GOOGLE_OAUTH_STATE.isSecure,
        sameSite: COOKIE_CONSTRAINT.GOOGLE_OAUTH_STATE.sameSite,
        expires: new Date(time.now() + time.inMinutes(10)) 
    })
}

// create code verifier
export function setGoogleCodeVerifierCookie(event: RequestEvent, codeVerifier: string) {
    event.cookies.set(COOKIE_NAME.GOOGLE_CODE_VERIFIER, codeVerifier, {
        httpOnly: COOKIE_CONSTRAINT.GOOGLE_CODE_VERIFIER.isHttpOnly,
        path: COOKIE_CONSTRAINT.GOOGLE_CODE_VERIFIER.path,
        secure: COOKIE_CONSTRAINT.GOOGLE_CODE_VERIFIER.isSecure,
        sameSite: COOKIE_CONSTRAINT.GOOGLE_CODE_VERIFIER.sameSite,
        expires: new Date(time.now() + time.inMinutes(10)) 
    })
}