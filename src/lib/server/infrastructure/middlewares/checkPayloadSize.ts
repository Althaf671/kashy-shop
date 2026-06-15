import { size } from "$lib/server/utils/general/size";
import type { Handle } from "@sveltejs/kit";

export async function checkPayloadSizeMiddleware({ event, resolve }: Parameters<Handle>[0]) {
    let MAX_PAYLOAD = size.inMB(2)
    let max = 2

    const contentLength = event.request.headers.get('content-length')

    // NOTE: need to apply to all form based 
    const isCreateProductForm = event.url.pathname === '/dashboard/shop-management/create'
    if (isCreateProductForm) {
        MAX_PAYLOAD = size.inMB(20)
        max = 20
    }

    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD)
        return new Response(`Input item cannot bigger than ${max} MB.`, { status: 413 })

    return await resolve(event)
}
