import { loginWithGoogleAuthorization } from "$lib/server/infrastructure/identity/auth.service";
import type { RequestEvent } from "./$types";
import { redirect } from "@sveltejs/kit";

export function GET(event: RequestEvent): Response {
    const loginResult = loginWithGoogleAuthorization(event)
    throw redirect(302, loginResult.value.url!)
}