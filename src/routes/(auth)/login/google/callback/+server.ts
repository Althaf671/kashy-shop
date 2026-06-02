import { loginWithGoogleAuthorizationCallbackAsync } from "$lib/server/infrastructure/identity/auth.service";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { setSessionTokenCookie } from "$lib/server/infrastructure/http/cookies/session-cookies";

export async function GET(event: RequestEvent): Promise<Response> {
    const callbackResult = await loginWithGoogleAuthorizationCallbackAsync(event)

    if (callbackResult.isFailure) {
        const errorMsg = encodeURIComponent(callbackResult.error.description!)
        throw redirect(302, `/login?error=${errorMsg}`)
    }

    setSessionTokenCookie(event, callbackResult.value.token, callbackResult.value.expiresAt)

    throw redirect(302, callbackResult.value.url!)
}