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

/**
 * @returns `today: () => new Date(time.now()).toISOString()`
 * @returns `oneDayAgo: () => new Date(time.now() - time.inDays(1)).toISOString()`
 * @returns `oneWeekAgo: () => new Date(time.now() - time.inDays(7)).toISOString()`
 * @returns `oneMonthAgo: () => new Date(time.now() - time.inDays(30)).toISOString()`
 */
export const metricTime = {
   today: () => new Date(time.now()).toISOString(),
   oneDayAgo: () => new Date(time.now() - time.inDays(1)).toISOString(),
   oneWeekAgo: () => new Date(time.now() - time.inDays(7)).toISOString(),
   oneMonthAgo: () => new Date(time.now() - time.inDays(30)).toISOString()
}