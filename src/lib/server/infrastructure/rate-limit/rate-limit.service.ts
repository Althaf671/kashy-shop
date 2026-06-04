import { TokenBucketRateLimit } from "./token-bucket";
import { rateLimitConstraint } from "$lib/server/config/rate-limit";
import { messages, statusCodes } from "$lib/constants/";
import { Result } from "$lib/types/global";

const DOMAIN = "RateLimitService" as const

const authLimiter = new TokenBucketRateLimit<string>(
    rateLimitConstraint.authRequestLimit.attempts,
    rateLimitConstraint.authRequestLimit.minutes)

const protectedLimiter = new TokenBucketRateLimit<string>(
    rateLimitConstraint.dashboardRequestLimit.attemps,
    rateLimitConstraint.dashboardRequestLimit.minutes
)

export function authRateLimit(ip: string): Result<boolean> {
    const valid = authLimiter.consume(ip, 1)
    if (!valid)
        return Result.failure({
            code: statusCodes.TO_MANY_REQUEST,
            description: messages.TO_MANY_REQUEST(1),
            domain: DOMAIN
        })

    return Result.success(true)
}

export function protectedResourceRateLimit(ip: string): Result<boolean> {
    const valid = protectedLimiter.consume(ip, 1)
    if (!valid) 
        return Result.failure({
            code: statusCodes.TO_MANY_REQUEST,
            description: messages.TO_MANY_REQUEST(1),
            domain: DOMAIN
        })

    return Result.success(true)
}