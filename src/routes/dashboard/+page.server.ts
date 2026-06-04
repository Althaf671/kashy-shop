
import type { IUser } from "$lib/types/features";
import type { Actions, PageServerLoad } from "./$types";

export async function load(event: Parameters<PageServerLoad>[0]) {
    return { user: event.locals.user } satisfies { user: IUser | null };
}

export const actions: Actions = {
    getMyData: async function getMyData(event) {
        return { user: event.locals.user } satisfies { user: IUser | null };
    }
}