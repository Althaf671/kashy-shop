import { z } from "zod";
import type { TCloudinaryFile } from "../global";
import { USERS_CONSTRAINT } from "$lib/server/data";
import { ACCEPTED_IMAGE_TYPES, KASH } from "$lib/constants";
import { size } from "$lib/server/utils/general/size";

//--- user auth config -------------------
export type TGetDeviceInfoResponse = {
    device: string;
    os: string;
    browser: string;
    deviceType: string;
}

export interface ISession {
	token: string;
	userId: string;
    ipAddress?: string;
    device?: string;
    os?: string;
    browser?: string;
    expiresAt: Date;
}

export interface IUser {
    id: string; 
    email: string;
    name: string;
    phone: string;
    avatarPicture: { url: TCloudinaryFile }; 
}

export interface IGoogleIdTokenClaims {
    sub: string;     
    name: string;    
    email: string;    
    picture?: string; 
}

export type TCreateSessionRequest = Omit<ISession, 'expiresAt'>

export type TSessionValidationResult = 
    { session: ISession; user: IUser } | 
    { session: null; user: null };

export type LoginLogoutResponse = { 
    message: string;
    url: string;
}

//--- get my profile ---------------------
export const GetMyProfileDetailsScheme = z.object({
    userId: z.uuid({ error: "Invalid user Id." })
})

export type TGetMyProfileDetailsRequest = z.infer<typeof GetMyProfileDetailsScheme>

export type TGetMyProfileDetailsResponse = {
    id: string;
    name: string;
    email: string;
    phone: string;
    birthdayAt?: string | undefined;
    quote: string;
    biography: string;
    profileBanner: TCloudinaryFile | undefined;
    avatarPicture: TCloudinaryFile;
    createdAt: string;
}

//--- Patch My Profile -------------------
export const PatchMyProfileScheme = z.object({
    userId: z.uuid({ error: "Invalid user Id." }),
    name: z
        .string()
        .max(USERS_CONSTRAINT.nameLength, `Maximum ${USERS_CONSTRAINT.nameLength} characters, ${KASH}.`)
        .optional(),
    email: z
        .email({ error: "Invalid email format" })
        .max(USERS_CONSTRAINT.emailLength, { error: `Maximum email length is ${USERS_CONSTRAINT.emailLength}.` })
        .optional(),
    phone: z.e164(`Please input a valid phone number. (eg: +628xxx)`)
        .trim()
        .optional(),
    birthdayAt: z
        .date()
        .optional(),
    biography: z
        .string()
        .max(USERS_CONSTRAINT.BIO_MAX_LENGTH, `Maximum ${USERS_CONSTRAINT.BIO_MAX_LENGTH} characters, ${KASH}.`)
        .optional(),
    profileBanner: z
        .file()
        .max(size.inMB(2), `Maximum file size is 2MB, ${KASH}.`)
        .mime(ACCEPTED_IMAGE_TYPES, `File format is must between JPG, JPEG, or WEBP, ${KASH}.`)
        .optional(),
    quote: z
        .string()
        .max(USERS_CONSTRAINT.QUOTE_MAX_LENGTH, `Maximum ${USERS_CONSTRAINT.QUOTE_MAX_LENGTH} characters, ${KASH}.`)
        .optional(),
    avatarPicture: z
        .file()
        .max(size.inMB(2), `Maximum file size is 2MB, ${KASH}.`)
        .mime(ACCEPTED_IMAGE_TYPES, `File format is must between JPG, JPEG, or WEBP, ${KASH}.`)
        .optional(),
})

export type TPatchMyProfileRequest = z.infer<typeof PatchMyProfileScheme>

export type TPatchMyProfileResponse = {
    id: string;
    name: string;
}

//--- get my session list -----------------
export const GetMySessionListScheme = z.object({
    userId: z.uuid({ error: "Invalid user Id." })
})

export type TGetMySessionListRequest = z.infer<typeof GetMyProfileDetailsScheme>

export type TGetMySessionListResponse = {
    device: string;
    browser: string;
    ipAddress: string;
    os: string;
    expiredAt: string;
}