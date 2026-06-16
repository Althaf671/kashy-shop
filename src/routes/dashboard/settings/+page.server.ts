import { messages, type TGetMySessionListResponse, type TPatchMyProfileRequest } from "$lib";
import { getMySessionListAsync, patchMyProfileAsync } from "$lib/server/features/user/user.service";
import { getOptionalFile, getOptionalString } from "$lib/utils/form";
import type { RequestEvent } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";

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

// [FATAL] TS MADE BY AI, I GOTTA SLEEP BUT NEED TO MAKE THIS WORK FIRST
export const actions: Actions = {
    patchProfile: async function patchProfile(event) {
        const formData = await event.request.formData();

        const userId = event.locals.user?.id

        // 1. Ambil file dari form
        const birthdayString = formData.get('birthdayAt') as string;

        // Jika kosong, berikan null atau undefined (sesuaikan dengan tipe kamu)
        const birthdayDate = birthdayString ? new Date(birthdayString) : undefined;

        const data: TPatchMyProfileRequest = {
            userId: userId!,
            name: getOptionalString(formData, 'name'),
            email: getOptionalString(formData, 'email'),
            phone: getOptionalString(formData, 'phone'),
            birthdayAt: formData.get('birthdayAt') ? new Date(formData.get('birthdayAt') as string) : undefined,
            biography: getOptionalString(formData, 'biography'),
            quote: getOptionalString(formData, 'quote'),
            avatarPicture: getOptionalFile(formData, 'avatarPicture'),
            profileBanner: getOptionalFile(formData, 'profileBanner'),
        };

        // 3. Panggil service
        const result = await patchMyProfileAsync(data);

        // 4. Handle response
        if (result.isFailure) {
            console.error("Error updating profile:", result.error);
            return fail(400, { error: result.error });
        }

        console.log("Success:", result.value);
        return { success: true };
    }
}