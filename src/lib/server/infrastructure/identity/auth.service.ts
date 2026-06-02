import { COOKIE_NAME } from "$lib/server/config/cookie";
import { Result, statusCodes } from "$lib/types/global";
import type { RequestEvent } from "@sveltejs/kit";
import { clearAuthSession, createSessionAsync, generateSessionToken, invalidateSessionAsync, invalidateUserSessionsAsync } from "./session";
import type { IGoogleIdTokenClaims, LoginLogoutResponse } from "$lib/types/features";
import { decodeIdToken, generateCodeVerifier, generateState, OAuth2Tokens } from "arctic";
import { authMessages, google, googleOAuthScopes } from "$lib/server/config/google";
import { setGoogleCodeVerifierCookie, setGoogleOAuthStateCookie } from "../http/cookies/google-cookies";
import { accounts, db } from "$lib/server/data";
import { eq } from "drizzle-orm";

const DOMAIN = "AuthService" as const

export function loginWithGoogleAuthorization(event: RequestEvent): Result<LoginLogoutResponse> {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const scopes = [googleOAuthScopes.OPEN_ID, googleOAuthScopes.PROFILE, googleOAuthScopes.EMAIL]
    const url = google.createAuthorizationURL(state, codeVerifier, scopes)

    setGoogleOAuthStateCookie(event, state)
    setGoogleCodeVerifierCookie(event, codeVerifier)

    return Result.success({
        message: authMessages.AUTHORIZATION_TOKENS_GENERATED,
        url: url.toString()
    })
}

export async function loginWithGoogleAuthorizationCallbackAsync(event: RequestEvent)
    : Promise<Result<{   
        message: string;
        url: string;
        token: string;
        expiresAt: Date 
    }>> 
{
    const code = event.url.searchParams.get("code")
    const state = event.url.searchParams.get("state")
    const storedState = event.cookies.get(COOKIE_NAME.GOOGLE_OAUTH_STATE) ?? null
    const codeVerifier = event.cookies.get(COOKIE_NAME.GOOGLE_CODE_VERIFIER) ?? null

    if (code === null || state === null || storedState === null || codeVerifier === null) {
        return Result.failure({
            code: statusCodes.BAD_REQUEST,
            description: authMessages.BAD_REQUEST,
            domain: DOMAIN
        })
    }

    if (state !== storedState) {
        return Result.failure({
            code: statusCodes.BAD_REQUEST,
            description: authMessages.BAD_REQUEST,
            domain: DOMAIN
        })
    }

    let tokens: OAuth2Tokens
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        return Result.failure({
            code: statusCodes.BAD_REQUEST,
            description: authMessages.BAD_REQUEST,
            domain: DOMAIN
        })
    }

    const claims = decodeIdToken(tokens.idToken()) as IGoogleIdTokenClaims
    const googleUserid = claims.sub

    const [existingUserIdentity] = await db
        .select({ id: accounts.userId })
        .from(accounts)
        .where(eq(accounts.providerAccountId, googleUserid))
        .limit(1)

    if (existingUserIdentity) {
        const sessionToken = generateSessionToken()
        const session = await createSessionAsync(sessionToken, existingUserIdentity.id)
        return Result.success({
            message: authMessages.AUTHORIZATION_GRANTED,
            token: session.token,
            expiresAt: session.expiresAt,
            url: "/"
        })
    } else {
        return Result.failure({
            code: statusCodes.FORBIDDEN,
            description: authMessages.FORBBIDEN,
            domain: DOMAIN
        })
    }
}

export async function logout(event: RequestEvent): Promise<Result<LoginLogoutResponse>> {
    const token = event.cookies.get(COOKIE_NAME.SESSION)

    try {
        if (token) {
            await invalidateSessionAsync(token)
        }

        clearAuthSession(event)

        return Result.success({ message: "Logged out successfully" })
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

export async function logoutAll(event: RequestEvent): Promise<Result<LoginLogoutResponse>> {
    const userId = event.locals.user?.id

    try {
        if (userId) {
            await invalidateUserSessionsAsync(userId)
        } 

        clearAuthSession(event)

        return Result.success({ message: "Logged out from all devices successfully" })
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}