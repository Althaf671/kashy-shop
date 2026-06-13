import { COOKIE_NAME } from "$lib/server/config/cookie";
import type { RequestEvent } from "@sveltejs/kit";
import { clearAuthSession, createSessionAsync, generateSessionToken, invalidateSessionAsync, invalidateUserSessionsAsync } from "./session";
import type { IGoogleIdTokenClaims, LoginLogoutResponse, TCreateSessionRequest, TGetDeviceInfoResponse } from "$lib/types/features";
import { decodeIdToken, generateCodeVerifier, generateState, OAuth2Tokens } from "arctic";
import { authMessages, google, googleOAuthScopes } from "$lib/server/config/google";
import { removeGoogleCodeVerifierCookie, removeGoogleOAuthStateCookie, setGoogleCodeVerifierCookie, setGoogleOAuthStateCookie } from "../http/cookies/google-cookies";
import { accounts, db } from "$lib/server/data";
import { eq } from "drizzle-orm";
import { setSessionTokenCookie } from "../http/cookies/session-cookies";
import { authRoutes, protectedRoutes } from "$lib/constants/route";
import { Result } from "$lib/types/global";
import { statusCodes } from "$lib/constants";
import { ENV } from "$lib/server/config/env";
import { UAParser } from "ua-parser-js";

const DOMAIN = "AuthService" as const

function isEmailWhitelist(email: string): boolean {
    return email.toLowerCase() === ENV.WHITELIST_EMAIL.toLowerCase()
}

function getDeviceInfo(userAgent: string): TGetDeviceInfoResponse {
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    return {
        device: `${result.device.vendor || ''} ${result.device.model || ''}`.trim(),
        os: `${result.os.name || ''} ${result.os.version}`.trim(),
        browser: `${result.browser.name || ''}`.trim()
    }
}

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
    : Promise<Result<LoginLogoutResponse>> 
{
    // oauth credentials
    const code = event.url.searchParams.get("code")
    const state = event.url.searchParams.get("state")
    const storedState = event.cookies.get(COOKIE_NAME.GOOGLE_OAUTH_STATE) ?? null
    const codeVerifier = event.cookies.get(COOKIE_NAME.GOOGLE_CODE_VERIFIER) ?? null

    // user device info
    const ipAddress = event.getClientAddress()
    const userAgent = event.request.headers.get('user-agent') || ''
    const deviceInfo = getDeviceInfo(userAgent)

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
    
    if (!isEmailWhitelist(claims.email))
        return Result.failure({
            code: statusCodes.UNAUTHENTICATED,
            description: authMessages.UNAUTHENTICATED,
            domain: DOMAIN
        })

    const googleUserid = claims.sub

    const [existingUserIdentity] = await db
        .select({ id: accounts.userId })
        .from(accounts)
        .where(eq(accounts.providerAccountId, googleUserid))
        .limit(1)

    if (existingUserIdentity) {
        const sessionToken = generateSessionToken()

        const sessionInfo: TCreateSessionRequest = {
            token: sessionToken,
            userId: existingUserIdentity.id,
            ipAddress: ipAddress,
            device: deviceInfo.device,
            os: deviceInfo.os,
            browser: deviceInfo.browser
        }
        const session = await createSessionAsync(sessionInfo)

        setSessionTokenCookie(event, sessionToken, session.expiresAt)
        removeGoogleOAuthStateCookie(event)
        removeGoogleCodeVerifierCookie(event)

        return Result.success({
            message: authMessages.AUTHORIZATION_GRANTED,
            url: protectedRoutes.DASHBOARD
        })
    } else {
        return Result.failure({
            code: statusCodes.UNAUTHENTICATED,
            description: authMessages.UNAUTHENTICATED,
            domain: DOMAIN
        })
    }
}

export async function logoutAsync(event: RequestEvent): Promise<Result<LoginLogoutResponse>> {
    const token = event.cookies.get(COOKIE_NAME.SESSION)

    try {
        if (token) {
            await invalidateSessionAsync(token)
        }

        clearAuthSession(event)

        return Result.success({ 
            message: "Logged out successfully",
            url: authRoutes.REDIRECT_TO_LOGIN
        })
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

export async function logoutAllAsync(event: RequestEvent): Promise<Result<LoginLogoutResponse>> {
    const userId = event.locals.user?.id

    try {
        if (userId) {
            await invalidateUserSessionsAsync(userId)
        } 

        clearAuthSession(event)

        return Result.success({ 
            message: "Logged out from all devices successfully",
            url: authRoutes.REDIRECT_TO_LOGIN
        })
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}