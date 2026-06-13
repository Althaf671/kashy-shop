import { messages, statusCodes } from "$lib/constants";
import { db, sessions, users } from "$lib/server/data";
import { GetMyProfileDetailsScheme, GetMySessionListScheme, type TGetMyProfileDetailsRequest, type TGetMyProfileDetailsResponse, type TGetMySessionListRequest, type TGetMySessionListResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";
import { format, formatDistanceToNow } from "date-fns";
import { eq } from "drizzle-orm";

const DOMAIN = "UserService" as const

//--- Get My Profile -------------------------------------
export async function GetMyProfileDetailsAsync(data: TGetMyProfileDetailsRequest)
    : Promise<Result<TGetMyProfileDetailsResponse>> 
{
    const validation = GetMyProfileDetailsScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const userId = validation.data.userId

    try {
        const [userRecord] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                phone: users.phone,
                birthdayAt: users.birthdayAt,
                biography: users.biography,
                profileBanner: users.profileBanner,
                quote: users.quote,
                avatarPicture: users.avatarPicture,
                createdAt: users.createdAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1)

        if (!userRecord)
            return Result.failure({
                code: statusCodes.NOT_FOUND,
                description: messages.NOT_FOUND("User", userId),
                domain: DOMAIN
            })

        const userData: TGetMyProfileDetailsResponse = {
            id: userRecord.id,
            name: userRecord.name,
            email: userRecord.email,
            phone: userRecord.phone,
            birthdayAt: format(new Date(userRecord.birthdayAt ?? new Date(2006, 5, 24)), 'd MMMM yyyy'),
            profileBanner: userRecord.profileBanner || undefined,
            biography: userRecord.biography || '-',
            quote: userRecord.quote || '-',
            avatarPicture: userRecord.avatarPicture,
            createdAt: userRecord.createdAt!.toLocaleString()
        }

        return Result.success(userData)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

//--- Get My Session list -------------------------------
export async function getMySessionListAsync(data: TGetMySessionListRequest)
    : Promise<Result<TGetMySessionListResponse[]>> 
{
    const validation = GetMySessionListScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const userId = validation.data.userId

    try {
        const sessionRecords = await db
            .select({ 
                device: sessions.device,
                browser: sessions.browser,
                ipAddress: sessions.ipAddress,
                os: sessions.os,
                expiredAt: sessions.expiredAt
            })
            .from(sessions)
            .where(eq(sessions.userId, userId))

        const result: TGetMySessionListResponse[] = sessionRecords.map((session) => ({
            device: session.device || 'Unkown',
            browser: session.browser || 'Unkown',
            ipAddress: session.ipAddress || 'Unkown',
            os: session.os || 'Unkown',
            expiredAt: formatDistanceToNow(session.expiredAt)
        }))

        return Result.success(result)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}