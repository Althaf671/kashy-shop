import { ENV } from "./env";

export const COOKIE_NAME = {
    SESSION: "__secureSession"
} as const

export const COOKIE_CONSTRAINT = {
    SESSION: {
        isHttpOnly: true,
        path: '/',
        isSecure: Boolean(ENV.IS_PRODUCTION) || true,
        sameSite: 'lax'
    }
} as const