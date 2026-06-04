import { loginWithGoogleAuthorizationCallbackAsync } from "$lib/server/infrastructure/identity/auth.service";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { authRoutes } from "$lib/constants/route";

export async function GET(event: RequestEvent): Promise<Response> {
    const callbackResult = await loginWithGoogleAuthorizationCallbackAsync(event)

    if (callbackResult.isFailure) {
        const errorMsg = encodeURIComponent(callbackResult.error.description!)
        throw redirect(302, `${authRoutes.REDIRECT_TO_LOGIN}?error=${errorMsg}`)
    }

    throw redirect(302, callbackResult.value.url!)
}