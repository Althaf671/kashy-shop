import { z } from "zod";
import type { TCloudinaryFile } from "../global";

//--- user auth config -------------------
export type TGetDeviceInfoResponse = {
    device: string;
    os: string;
    browser: string;
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

//--- get my session list ----------------
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