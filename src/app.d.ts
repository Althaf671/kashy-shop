// See https://svelte.dev/docs/kit/types#app.d.ts
import type { ISession, IUser } from "$lib/types/features";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser | null;
			session: ISession | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
