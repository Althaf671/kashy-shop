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