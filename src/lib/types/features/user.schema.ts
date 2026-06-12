import { z } from "zod";
import type { TCloudinaryFile } from "../global";

export interface ISession {
	token: string;
	expiresAt: Date;
	userId: string;
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

export type TSessionValidationResult = 
    { session: ISession; user: IUser } | 
    { session: null; user: null };

export type LoginLogoutResponse = { 
    message: string;
    url: string;
}

export const GetMyProfileDetailsScheme = z.object({
    userId: z.uuid({ error: "Invalid user Id." })
})

export type TGetMyProfileDetailsRequest = z.infer<typeof GetMyProfileDetailsScheme>

export type TGetMyProfileDetailsResponse = {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarPicture: TCloudinaryFile;
    createdAt: string;
}

export const GetMySessionListScheme = z.object({
    userId: z.uuid({ error: "Invalid user Id." })
})

export type TGetMySessionListRequest = z.infer<typeof GetMyProfileDetailsScheme>

export type TGetMySessionListResponse = {
    device: string;
    userAgent: string;
    ipAddress: string;
}