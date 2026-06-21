import { messages, statusCodes, type TGetMySessionListResponse, type TPatchMyProfileRequest } from "$lib";
import { getMySessionListAsync, patchMyProfileAsync } from "$lib/server/features/user/user.service";
import { TOAST_TYPE } from "$lib/types/global/ui.types";
import { parseErrorDescription } from "$lib/utils/errorParser";
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
        if (result.isFailure) {
            const { code, description } = result.error;

            if (code === statusCodes.VALIDATION_ERROR) {
                return fail(400, {
                    success: false,
                    errors: parseErrorDescription(description) 
                });
            }

            return fail(400, {
                success: false,
                reactiveToast: {
                    type: TOAST_TYPE.ERROR,
                    message: description 
                }
            });
        }

        return { 
            success: true,
            reactiveToast: {
                type: TOAST_TYPE.SUCCESS,
                message: result.value.message
            } 
        }
    }
}