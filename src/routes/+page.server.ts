import { redirect, type Actions } from "@sveltejs/kit";
import { logoutAllAsync, logoutAsync } from "$lib/server/infrastructure/identity/auth.service";

export const actions: Actions = {
    logout: async function logout(event) {
        const result = await logoutAsync(event)
        throw redirect(302, result.value.url)
    },
    logoutAll: async function logoutAll(event) {
        const result = await logoutAllAsync(event)
        throw redirect(302, result.value.url)
    }
}