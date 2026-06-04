import { COOKIE_NAME } from "$lib/server/config/cookie";
import { redirect, type Handle } from "@sveltejs/kit";
import {  clearAuthSession, validateSessionTokenAsync } from "../identity/session";
import { authRoutes, protectedRoutes } from "$lib/constants/";

export async function verifyAuthMiddleware({ event, resolve }: Parameters<Handle>[0])
    : Promise<Response>
{
    const token = event.cookies.get(COOKIE_NAME.SESSION)

    if (event.url.pathname.includes(authRoutes.CALLBACK))
        return await resolve(event)

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

    if (event.url.pathname.includes(protectedRoutes.DASHBOARD)) 
        if (!event.locals.user) throw redirect(302, authRoutes.REDIRECT_TO_LOGIN)

    return await resolve(event)
}