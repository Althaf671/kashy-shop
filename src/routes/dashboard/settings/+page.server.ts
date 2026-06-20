import { messages, type TGetMySessionListResponse, type TPatchMyProfileRequest } from "$lib";
import { getMySessionListAsync, patchMyProfileAsync } from "$lib/server/features/user/user.service";
import { TOAST_TYPE, type TFormErrors } from "$lib/types/global/ui.types";
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

export const actions: Actions = {
    patchProfile: async function patchProfile(event) {
        const formData = await event.request.formData();
        const userId = event.locals.user?.id
        if (!userId) 
            return fail(400, { 
                reactiveToast: { 
                    type: TOAST_TYPE.ERROR, 
                    message: "Invalid user ID." 
                } 
            });

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

        const result = await patchMyProfileAsync(data)
        if (result.isFailure)  {
            const description = result.error.description 
            const fieldError = description ? description.split(',').map(desc => desc.trim()) : []
            return fail(400, { 
                success: false,
                errors: {
                    name: fieldError.find(err => err.startsWith('name')),
                    email: fieldError.find(err => err.startsWith('email')),
                    phone: fieldError.find(err => err.startsWith('phone')),
                    birthdayAt: fieldError.find(err => err.startsWith('birthdayAt')),
                    biography: fieldError.find(err => err.startsWith('biography')),
                    quote: fieldError.find(err => err.startsWith('quote')),
                    profileBanner: fieldError.find(err => err.startsWith('profileBanner')),
                    avatarPicture: fieldError.find(err => err.startsWith('avatarPicture')),
                } as TFormErrors
            });
        }

        return { success: true };
    }
}