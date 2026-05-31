import Google from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";
import { ENV } from "../general/env";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { dev } from "$app/environment";
import { db } from "../../data/db";

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: DrizzleAdapter(db),
    providers: [Google({ clientId: ENV.GOOGLE_ID, clientSecret: ENV.GOOGLE_SECRET })],
    basePath: "/api/auth",
    callbacks: {
        async signIn({ user }) {
            return user.email === ENV.WHITELIST_EMAIL
        }
    },
    cookies: {
        sessionToken: {
            name: dev ? '__dev_session' : `__secure_session`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: !dev
            }
        }
    }
})
