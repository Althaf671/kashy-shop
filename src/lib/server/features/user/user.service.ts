import { messages, statusCodes } from "$lib/constants";
import { db, users } from "$lib/server/data";
import { GetMyProfileDetailsScheme, type TGetMyProfileDetailsRequest, type TGetMyProfileDetailsResponse } from "$lib/types/features";
import { Result } from "$lib/types/global";
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
            avatarPicture: userRecord.avatarPicture,
            createdAt: userRecord.createdAt!.toLocaleString()
        }

        return Result.success(userData)
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

//--- Update My Profile ----------------------------------