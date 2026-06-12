export const securityHeaders = {
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin',
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    // "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    // "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://res.cloudinary.com; connect-src 'self'; object-src 'none'; frame-ancestors 'none';"
} as const