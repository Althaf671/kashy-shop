import { ENV } from "./env";

export const COOKIE_NAME = {
    SESSION: "__secureSession",
    GOOGLE_OAUTH_STATE: "google_oauth_state",
    GOOGLE_CODE_VERIFIER: "google_code_verifier"
} as const

export const COOKIE_CONSTRAINT = {
    SESSION: {
        isHttpOnly: true,
        path: '/',
        isSecure: Boolean(ENV.IS_PRODUCTION),
        sameSite: 'lax'
    },
    GOOGLE_OAUTH_STATE: {
        isHttpOnly: true,
        path: '/',
        isSecure: Boolean(ENV.IS_PRODUCTION),
        sameSite: 'lax'  
    },
    GOOGLE_CODE_VERIFIER: {
        isHttpOnly: true,
        path: '/',
        isSecure: Boolean(ENV.IS_PRODUCTION),
        sameSite: 'lax' 
    }
} as const