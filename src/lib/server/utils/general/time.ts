import { addDays, addMonths, differenceInDays, differenceInHours, startOfMonth, startOfWeek } from "date-fns";

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
 * @returns `rangeBetweenTodayAndYesterday are returning hour range from yesterday's 00.00 to todays 00.00 (exact 24h).`
 * @returns `rangeBetweenCurrentWeekAndLastWeek are returning day range from sunday 00.00 to next sunday 00.00 (exact 7 days) or (exact 168 hours).`
 * @returns `oneMonthAgo: () => new Date(time.now() - time.inDays(30)).toISOString()`
 */
export const metricTime = {
    rangeBetweenTodayAndYesterday: (): { 
        startOfToday: string, 
        startOfYesterday: string,
        durationInHours: number 
    } => {
        // get todays time from hour 00.00
        const startOfToday = new Date()
        startOfToday.setUTCHours(0, 0, 0, 0)

        // get yesterday's time from hour 00.00
        const startOfYesterday = new Date()
        startOfYesterday.setUTCDate(startOfToday.getUTCDate() - 1)
        startOfYesterday.setUTCHours(0, 0, 0, 0)

        // return hour range from yesterday's 00.00 to todays 00.00 (exact 24h)
        return { 
            startOfToday: startOfToday.toISOString(), 
            startOfYesterday: startOfYesterday.toISOString(),
            durationInHours: differenceInHours(startOfToday, startOfYesterday)
        }
   },
   rangeBetweenCurrentWeekAndLastWeek: (): { 
        startOfCurrentWeek: string, 
        startOfLastWeek: string,
        durationInDays: number 
    } => {
        // set start of current week period
        const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })

        // set start of last week period 
        const startOfLastWeek = addDays(startOfCurrentWeek, -7)

        // return day range from sunday 00.00 to next sunday 00.00 (exact 7 days) or (exact 168 hours)
        return {
            startOfCurrentWeek: startOfCurrentWeek.toISOString(),
            startOfLastWeek: startOfLastWeek.toISOString(),
            durationInDays: differenceInDays(startOfCurrentWeek, startOfLastWeek)
        }
   },
   rangeBetweenCurrentMonthAndLastMonth: (): {
        startOfCurrentMonth: string;
        startOfLastMonth: string;
        durationInDays: number;
   } => {
        // set start of this month period
        const startOfCurrentMonth = startOfMonth(new Date)

        // set start of last month period
        const startOfLastMonth = addMonths(startOfCurrentMonth, - 1)

        // return month range from first date of last month to current month (duration depends on which month).
        return {
            startOfCurrentMonth: startOfCurrentMonth.toISOString(),
            startOfLastMonth: startOfLastMonth.toISOString(),
            durationInDays: differenceInDays(startOfCurrentMonth, startOfLastMonth)
        }
   }
}

// 