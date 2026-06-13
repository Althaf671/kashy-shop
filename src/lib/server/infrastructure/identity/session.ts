import { encodeBase32 } from "@oslojs/encoding";
import { db, sessions, users } from "$lib/server/data";
import { eq } from "drizzle-orm";
import { time } from "$lib/server/utils/general/time";
import { getNewSessionExpirationDate, SLIDING_DURATION_WINDOW } from "$lib/server/config/session";
import { hashSessionToken } from "$lib/server/utils/general/crypto";
import type { ISession, IUser, TCreateSessionRequest, TSessionValidationResult } from "$lib/types/features";
import type { RequestEvent } from "@sveltejs/kit";
import { removeSessionTokenCookie } from "../http/cookies/session-cookies";

// create session token
export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20)
    crypto.getRandomValues(tokenBytes)
    const token = encodeBase32(tokenBytes).toLowerCase()
    return token
}

// create session (assign session to cookie session) 
export async function createSessionAsync(data: TCreateSessionRequest): Promise<ISession> {
    const sessionToken = hashSessionToken(data.token)

    // actually it the same, i can just pass it lol
    const session: ISession = {
        token: sessionToken,
        userId: data.userId,
        device: data.device,
        ipAddress: data.ipAddress,
        os: data.os,
        browser: data.browser,
        expiresAt: getNewSessionExpirationDate()
    }

    await db
        .insert(sessions)
        .values({
            sessionToken: session.token,
            userId: session.userId,
            device: session.device,
            os: session.os,
            browser: session.browser,
            ipAddress: session.ipAddress,
            expiredAt: session.expiresAt
        })

    return session
}

// validate all incoming session token
// NOTE: LATER I MIGHT UPGRADE SECURITY BY USING THE ADVANTAGE OF LOGGING IP, DEVICE, AND USER AGENT, perhaps fingerprint next...
export async function validateSessionTokenAsync(token: string): Promise<TSessionValidationResult> {
    const sessionId = hashSessionToken(token)

    const result = await db
        .select({
            session: sessions,
            user: users
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.sessionToken, sessionId));

    if (result.length === 0) return { session: null, user: null }

    const { session, user } = result[0]

    const isExpired = time.now() >= session.expiredAt.getTime()

    if (isExpired) {
        await db
            .delete(sessions)
            .where(eq(sessions.sessionToken, session.sessionToken))

        return { session: null, user: null }
    }

    const expirationThreshold = session.expiredAt.getTime() - SLIDING_DURATION_WINDOW
    const isWithinRenewalWindow = time.now() >= expirationThreshold

    if (isWithinRenewalWindow) {
        session.expiredAt = getNewSessionExpirationDate()
        await db
            .update(sessions)
            .set({ expiredAt: session.expiredAt })
            .where(eq(sessions.sessionToken, session.sessionToken))
    }

    const sessionRes: ISession = {
        token: session.sessionToken,
        userId: session.userId,
        expiresAt: session.expiredAt
    }

    const userRes: IUser = {
        id: user.id, 
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatarPicture: { url: user.avatarPicture } 
    }

    return { session: sessionRes, user: userRes }
}

// invalidate incoming user session
export async function invalidateSessionAsync(token: string): Promise<void> {
    const sessionToken = hashSessionToken(token)

    await db
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
}

// invalidate all sessions for selected usere
export async function invalidateUserSessionsAsync(userId: string): Promise<void> {
    await db
        .delete(sessions)
        .where(eq(sessions.userId, userId))
}

// clear local auth session
export function clearAuthSession(event: RequestEvent) {
    removeSessionTokenCookie(event)
    event.locals.user = null
    event.locals.session = null
}