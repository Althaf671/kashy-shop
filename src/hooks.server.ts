import { 
    applySecurityHeadersMiddleware, 
    checkPayloadSizeMiddleware, 
    checkRateLimitMiddleware, 
    verifyAuthMiddleware 
} from "$lib/server/infrastructure/middlewares";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const handle: Handle = sequence(
    applySecurityHeadersMiddleware,
    checkRateLimitMiddleware,
    verifyAuthMiddleware,
    checkPayloadSizeMiddleware,
)