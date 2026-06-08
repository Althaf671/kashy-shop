import { securityHeaders } from "$lib/server/config/headers";
import type { Handle } from "@sveltejs/kit";

export async function applySecurityHeadersMiddleware({ event, resolve }: Parameters<Handle>[0]) {
    const response = await resolve(event)
    Object.entries(securityHeaders).forEach(
        ([headers, value]) => response.headers.set(headers, value)
    )
    return response
}