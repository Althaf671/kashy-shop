import { COOKIE_NAME } from "$lib/server/config/cookie";
import { Result } from "$lib/types/global";
import type { RequestEvent } from "@sveltejs/kit";
import { clearAuthSession, invalidateSessionAsync, invalidateUserSessionsAsync } from "./session";
import type { LoginLogoutResponse } from "$lib/types/features";

const DOMAIN = "AuthService" as const

export async function loginWithGoogleAsync(): Promise<Result<LoginLogoutResponse>> {

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