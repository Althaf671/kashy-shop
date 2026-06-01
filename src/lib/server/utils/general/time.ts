/**
 * @returns now: `() => Date.now()`
 * @returns inDays: `(n: number) => n * 24 * 60 * 60 * 1000`
 * @returns inHours: `(n: number) => n * 60 * 60 * 1000`
 * @returns inMinutes: `(n: number) => n * 60 * 1000`
 */
export const time = {
    now: () => Date.now(),
    inDays: (n: number) => n * 24 * 60 * 60 * 1000,
    inHours: (n: number) => n * 60 * 60 * 1000,
    inMinutes: (n: number) => n * 60 * 1000,
}