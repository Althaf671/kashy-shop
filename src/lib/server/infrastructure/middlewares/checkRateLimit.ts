import { ALLOWED_METHOD, authRoutes, errorRoutes, protectedRoutes, staticRoutes } from "$lib/constants/route";
import { error, redirect, type Handle } from "@sveltejs/kit";
import { authRateLimit, protectedResourceRateLimit } from "../rate-limit/rate-limit.service";

export async function checkRateLimitMiddleware({ event, resolve }: Parameters<Handle>[0])
    : Promise<Response>
{
    const pathname = event.url.pathname;

    if (pathname.startsWith(staticRoutes.APP) || pathname.startsWith(staticRoutes.FAVICON)) 
        return await resolve(event)

    if (!ALLOWED_METHOD.has(event.request.method)) throw redirect(403, errorRoutes.FORBIDDEN)
        
    if (pathname.startsWith(authRoutes.AUTH_AREA)) {
        if (pathname !== authRoutes.REDIRECT_TO_GOOGLE) {
            const rateLimit = authRateLimit(event.getClientAddress())
            if (rateLimit.isFailure) throw error(429, rateLimit.error.description!)
        }
    }

    if (pathname.startsWith(protectedRoutes.DASHBOARD)) {
        const rateLimit = protectedResourceRateLimit(event.getClientAddress())
        if (rateLimit.isFailure) throw error(429, rateLimit.error.description!)
    }

    return await resolve(event)
}
