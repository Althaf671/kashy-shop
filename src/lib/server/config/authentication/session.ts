import { SLIDING_DURATION_WINDOW, TOKEN_CONSTRAINT, TOKEN_NAME, type TCloudinaryFile } from "$lib/types/global";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";
import { db, sessions, users } from "$lib/server/data";
import { eq } from "drizzle-orm";
import { time } from "$lib/server/utils/general/time";

export interface Session {
	token: string;
	expiresAt: Date;
	userId: string;
}

export interface User {
    id: string; 
    email: string;
    name: string;
    phone: string;
    avatarPicture: { url: TCloudinaryFile }; 
}

type SessionValidationResult = 
    { session: Session; user: User } | 
    { session: null; user: null };

//--- Functions to manage user sessions ------------
// validate all incoming session token
export async function validateSessionTokenAsync(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

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
        session.expiredAt = new Date(time.now() + time.inDays(15))
        await db
            .update(sessions)
            .set({ expiredAt: session.expiredAt })
            .where(eq(sessions.sessionToken, session.sessionToken))
    }

    const sessionRes: Session = {
        token: session.sessionToken,
        userId: session.userId,
        expiresAt: session.expiredAt
    }

    const userRes: User = {
        id: user.id, 
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatarPicture: { url: user.avatarPicture } 
    }

    return { session: sessionRes, user: userRes }
}

// invalidate incoming user session
export async function invalidateSessionAsync(sessionToken: string): Promise<void> {
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

//--- Utils function to obtain session -------------
// create session token
export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20)
    crypto.getRandomValues(tokenBytes)
    const token = encodeBase32(tokenBytes).toLocaleLowerCase()
    return token
}

// create session
export async function createSessionAsync(token: string, userId: string): Promise<Session> {
    const sessionToken = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const session: Session = {
        token: sessionToken,
        userId,
        expiresAt: new Date(time.now() + time.inDays(15))
    }

    await db
        .insert(sessions)
        .values({
            sessionToken: session.token,
            userId: session.userId,
            expiredAt: session.expiresAt
        })

    return session
}

// create session cookie
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set(TOKEN_NAME.SESSION, token, {
        httpOnly: TOKEN_CONSTRAINT.SESSION.isHttpOnly,
        path: TOKEN_CONSTRAINT.SESSION.path,
        secure: TOKEN_CONSTRAINT.SESSION.isSecure,
        sameSite: TOKEN_CONSTRAINT.SESSION.sameSite,
        maxAge: TOKEN_CONSTRAINT.SESSION.maxAge,
        expires: expiresAt
    })
}
