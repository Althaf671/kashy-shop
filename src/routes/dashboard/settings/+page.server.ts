import { messages, type TGetMySessionListResponse } from "$lib";
import { getMySessionListAsync } from "$lib/server/features/user/user.service";
import type { RequestEvent } from "./$types";

export async function load(event: RequestEvent)
    : Promise<{ 
        mySessions?: TGetMySessionListResponse[],
        error?: string 
    }> 
{
    const userId = event.locals.user?.id
    if (!userId) return { error: messages.NOT_FOUND("User Id") }

    const mySessions = await getMySessionListAsync({ userId: userId })
    if (mySessions.isFailure) return { error: mySessions.error.description }

    return { mySessions: mySessions.value }
} 