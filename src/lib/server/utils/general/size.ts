/**
 * @returns `inKB: (n: number): number => n * 1024,`
 * @returns `inMB: (n: number): number => n * 1024 * 1024`
 */
export const size = {
    inKB: (n: number): number => n * 1024,
    inMB: (n: number): number => n * 1024 * 1024
} 