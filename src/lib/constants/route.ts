export const protectedRoutes = {
    DASHBOARD: "/dashboard"
}

export const ALLOWED_METHOD = new Set(["POST", "GET", "PATCH", "DELETE"]);

export const authRoutes = {
    REDIRECT_TO_LOGIN: "/auth/login",
    REDIRECT_TO_GOOGLE: "/auth/login/google",
    CALLBACK: "/callback",
    AUTH_AREA: "/auth"
} as const

export const staticRoutes = {
    APP: "/_app",
    FAVICON: "/favicon"
} as const

export const errorRoutes = {
    NOT_FOUND: "/not-found",
    FORBIDDEN: "/forbidden",
    INTERNAL_SERVER_ERROR: "/unexpected"
}