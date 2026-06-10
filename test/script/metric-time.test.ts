import { metricTime } from "$lib/server/utils/general/time";

// [command]: bun run metric-time.test.ts

const message = {
    TODAY_RANGE: "Range between today and yesterday: ",
    WEEK_RANGE: "Range between current week and last week: ",
    MONTH_RANGE: "Range between current month and last month: "
} as const

console.log(message.TODAY_RANGE, metricTime.rangeBetweenTodayAndYesterday())
console.log(message.WEEK_RANGE, metricTime.rangeBetweenCurrentWeekAndLastWeek())
console.log(message.MONTH_RANGE, metricTime.rangeBetweenCurrentMonthAndLastMonth())