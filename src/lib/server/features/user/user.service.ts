import { 
    GetMyProfileDetailsScheme, 
    GetMySessionListScheme, 
    PatchMyProfileScheme, 
    type TGetMyProfileDetailsRequest, 
    type TGetMyProfileDetailsResponse, 
    type TGetMySessionListRequest, 
    type TGetMySessionListResponse, 
    type TPatchMyProfileRequest, 
    type TPatchMyProfileResponse 
} from "$lib/types/features";
import { messages, statusCodes } from "$lib/constants";
import { db, sessions, users } from "$lib/server/data";
import { Result, type TCloudinaryFile } from "$lib/types/global";
import { format, formatDistanceToNow } from "date-fns";
import { eq } from "drizzle-orm";
import { cleanupPreviousFileAsync, processAndUploadImageAsync } from "$lib/server/utils";

// [FATAL REFACTOR]: NEED TO SEARCH FOR ANY ISSUES IN EVERY UPDATE/PATCH SERVICES QUERY

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
        return Result.serverError(messages.SERVER_ERROR, DOMAIN)
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
        return Result.serverError(messages.SERVER_ERROR, DOMAIN)
    }
}

//--- Patch My Profile ----------------------------------
export async function patchMyProfileAsync(data: TPatchMyProfileRequest)
    : Promise<Result<TPatchMyProfileResponse>>
{
    const validation = PatchMyProfileScheme.safeParse(data)
    if (!validation.success) return Result.validationFailure(validation.error, DOMAIN)

    const patchData = validation.data

    let finalAvatar: TCloudinaryFile | undefined = undefined
    let prevAvatar: TCloudinaryFile | undefined = undefined

    let finalBanner: TCloudinaryFile | undefined = undefined
    let prevBanner: TCloudinaryFile | undefined = undefined

    try {
        // check is user exist and return prev avatar and banner
        const exisitingUser = await checkAndGetUserAsync(patchData.userId)
        if (exisitingUser.isFailure) return Result.failure(exisitingUser.error)

        // check for existing email 
        if (patchData.email !== undefined && patchData.email !== exisitingUser.value.email) {
            const isDuplicated = await isEmailDuplicated(patchData.email)
            if (isDuplicated.isFailure) return Result.failure(isDuplicated.error)
        }

        // check for exisiting phone
        if (patchData.phone !== undefined && patchData.phone !== exisitingUser.value.phone) {
            const isDuplicated = await isPhoneDuplicated(patchData.phone)
            if (isDuplicated.isFailure) return Result.failure(isDuplicated.error)
        }

        // compress and upload avatar
        if (patchData.avatarPicture !== undefined) {
            const mediaResult = await processAndUploadImageAsync(patchData.avatarPicture, 'square')
            if (mediaResult.isFailure) return Result.failure(mediaResult.error)

            if (mediaResult) {
                prevAvatar = exisitingUser.value.avatarPicture
                finalAvatar = mediaResult.value
            }
        }

        // compress and upload banner
        if (patchData.profileBanner !== undefined) {
            const mediaResult = await processAndUploadImageAsync(patchData.profileBanner, 'wide')
            if (mediaResult.isFailure) return Result.failure(mediaResult.error)

            if (mediaResult) {
                prevBanner = exisitingUser.value.profileBanner
                finalBanner = mediaResult.value
            }
        }

        // save to database
        await db
            .update(users)
            .set({
                ...(patchData.name !== undefined && { name: patchData.name }),
                ...(patchData.email !== undefined && { email: patchData.email }),
                ...(patchData.phone !== undefined && { phone: patchData.phone }),
                ...(patchData.birthdayAt !== undefined && { birthdayAt: patchData.birthdayAt }),
                ...(patchData.biography !== undefined && { biography: patchData.biography }),
                ...(finalAvatar !== undefined && { avatarPicture: finalAvatar }),
                ...(patchData.quote !== undefined && { quote: patchData.quote }),
                ...(finalBanner !== undefined && { profileBanner: finalBanner }),
                updatedAt: new Date()
            })
            .where(eq(users.id, patchData.userId))
            .returning()

        // remove prev image from storage
        await cleanupPreviousFileAsync(prevAvatar)
        await cleanupPreviousFileAsync(prevBanner)

        return Result.success({ message: "Success updating your personal information." })
    } catch (error: unknown) {
        // rollback uploaded image if save db failed
        await cleanupPreviousFileAsync(finalAvatar)
        await cleanupPreviousFileAsync(finalBanner)
        return Result.serverError(messages.SERVER_ERROR, DOMAIN)
    }
}

//--- helper -------------------------------------
async function checkAndGetUserAsync(userId: string)
    : Promise<Result<{ 
        avatarPicture: TCloudinaryFile,
        profileBanner: TCloudinaryFile,
        email: string,
        phone: string
     }>> 
{
    const [userRecord] = await db
        .select({
            id: users.id,
            avatarPicture: users.avatarPicture,
            profileBanner: users.profileBanner,
            email: users.email,
            phone: users.phone
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

    return Result.success({ 
        avatarPicture: userRecord.avatarPicture!, 
        profileBanner: userRecord.profileBanner!,
        email: userRecord.email,
        phone: userRecord.phone
    })
}

async function isEmailDuplicated(email: string): Promise<Result<boolean>> {
    const [isEmailDuplicated] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    if (isEmailDuplicated)  
        return Result.failure({
            code: statusCodes.DUPLICATED,
            description: messages.DUPLICATED("User", "email", email),
            domain: DOMAIN
        })

    return Result.success(true)
}

async function isPhoneDuplicated(phone: string): Promise<Result<boolean>> {
    const [isPhoneEmail] = await db
        .select({ email: users.phone })
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1)

    if (isPhoneEmail)  
        return Result.failure({
            code: statusCodes.DUPLICATED,
            description: messages.DUPLICATED("User", "phone", phone),
            domain: DOMAIN
        })

    return Result.success(true)
}