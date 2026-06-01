import { COOKIE_NAME } from "$lib/server/config/cookie";
import type { Handle } from "@sveltejs/kit";
import { clearAuthSession, validateSessionTokenAsync } from "../identity/session";

export async function verifyAuthMiddleware({ event, resolve }: Parameters<Handle>[0])
    : Promise<Response>
{
    const token = event.cookies.get(COOKIE_NAME.SESSION)

    if (token) {
        const result = await validateSessionTokenAsync(token)

        if (result.user && result.session) {
            event.locals.user = result.user
            event.locals.session = result.session
        } else {
            clearAuthSession(event)
        }
    } else {
        clearAuthSession(event)
    }

    return await resolve(event)
}