import { 
    applySecurityHeadersMiddleware, 
    checkPayloadSizeMiddleware, 
    checkRateLimitMiddleware, 
    verifyAuthMiddleware 
} from "$lib/server/infrastructure/middlewares";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";


// global error handler
// async function caughtFatalErrosMiddleware() {

// }

export const handle: Handle = sequence(
    applySecurityHeadersMiddleware,
    checkRateLimitMiddleware,
    verifyAuthMiddleware,
    checkPayloadSizeMiddleware,
)