import { messages, type TGetMyProfileDetailsResponse } from "$lib";
import { GetMyProfileDetailsAsync } from "$lib/server/features/user/user.service";
import type { RequestEvent } from "./$types";

export async function load(event: RequestEvent)
    : Promise<{ myProfile?: TGetMyProfileDetailsResponse, error?: string }> 
{
    const userId = event.locals.user?.id
    if (!userId) return { error: messages.NOT_FOUND("User Id") }

    const myProfile = await GetMyProfileDetailsAsync({ userId: userId })
    if (myProfile.isFailure) return { error: myProfile.error.description }

    return { myProfile: myProfile.value }
} 