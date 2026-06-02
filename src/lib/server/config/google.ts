import { Google } from "arctic";
import { ENV } from "./env";

export const google = new Google(
    ENV.GOOGLE_ID,
    ENV.GOOGLE_SECRET,
    ENV.LOCALHOST_CALLBACK_URL
) 

export const googleOAuthScopes = {
    OPEN_ID: "openid",
    PROFILE: "profile",
    EMAIL: "email"
} as const

export const authMessages = {
    BAD_REQUEST: "Invalid google authorization callback tokens.",
    AUTHORIZATION_TOKENS_GENERATED: "Google OAuth tokens generated.",
    AUTHORIZATION_GRANTED: "Authorization granted.",
    FORBBIDEN: "Authorization not granted."
} as const