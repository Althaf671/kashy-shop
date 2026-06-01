import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

/**
 * @returns `encodeHexLowerCase(sha256(new TextEncoder().encode(token)))`
 */
export function hashSessionToken(token: string): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}