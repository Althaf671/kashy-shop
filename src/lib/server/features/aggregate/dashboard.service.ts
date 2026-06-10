import { categories, db, products } from "$lib/server/data";
import { getProgressTrend } from "$lib/server/utils/general/generator";
import { metricTime } from "$lib/server/utils/general/time";
import type { TDashboardData } from "$lib/types/features/dashboard.schema";
import { Result } from "$lib/types/global";
import { and, eq, sql } from "drizzle-orm";

const DOMAIN = "DashboardService" as const

export async function getDashboardAggregateDataAsync()
    : Promise<Result<TDashboardData[]>> 
{    
    console.log("Initiating get dashboard aggregate data.")

    try {
        console.log("Entering the try catch block.")

        // get sales aggregate 

        // get category aggregate
        const categoryData = await getCategoryAggregateDataAsync()
        if (categoryData.isFailure) return Result.failure(categoryData.error)

        // get active product aggregate
        const productData = await getActiveProductAggregateDataAsync()
        if (productData.isFailure) return Result.failure(productData.error)

        // get completed order aggregate

        // map fake data
        const salesData: TDashboardData = {
            allTimeData: {
                name: "Sales",
                totalValue: 1000,
                progress: {
                    trend: getProgressTrend(1000, 300),
                    value: 300
                }
            },
        }

        const completedOrderData: TDashboardData = {
            allTimeData: {
                name: "Completed Orders",
                totalValue: 4,
                progress: {
                    trend: getProgressTrend(4, 2),
                    value: 2
                }
            },
        }

        const finalData: TDashboardData[] = [
            salesData,
            categoryData.value,
            productData.value,
            completedOrderData
        ]

        return Result.success(finalData)    
    } catch (error: unknown) {
        return Result.serverError(error, DOMAIN)
    }
}

//--- get category aggregate ------------
async function getCategoryAggregateDataAsync(): Promise<Result<TDashboardData>> {
    // yesterday to today range
    const startOfToday = metricTime.rangeBetweenTodayAndYesterday().startOfToday
    const startOfYesterday = metricTime.rangeBetweenTodayAndYesterday().startOfYesterday

    // last to current week range
    const startOfCurrentWeek = metricTime.rangeBetweenCurrentWeekAndLastWeek().startOfCurrentWeek
    const startOfLastWeek = metricTime.rangeBetweenCurrentWeekAndLastWeek().startOfLastWeek

    // last to current month range
    const startOfCurrentMonth = metricTime.rangeBetweenCurrentMonthAndLastMonth().startOfCurrentMonth
    const startOfLastMonth = metricTime.rangeBetweenCurrentMonthAndLastMonth().startOfLastMonth

    const [categoryStats] = await db
        .select({
            totalCount: sql<number>`COUNT (*)`,
            yesterdayCount: sql<number>`
                SUM(CASE 
                    WHEN ${categories.createdAt} >= ${startOfYesterday} AND ${categories.createdAt} <= ${startOfToday} 
                    THEN 1 
                    ELSE 0 
                END)`, 
            lastWeekCount: sql<number>`
                SUM(CASE
                    WHEN ${categories.createdAt} >= ${startOfLastWeek} AND ${categories.createdAt} <= ${startOfCurrentWeek}
                    THEN 1
                    ELSE 0
                END)`,
            lastMonthCount: sql<number>`
                SUM(CASE
                    WHEN ${categories.createdAt} >= ${startOfLastMonth} AND ${categories.createdAt} <= ${startOfCurrentMonth}
                    THEN 1
                    ELSE 0
                END)`
        })
        .from(categories)
        .where(eq(categories.isSoftDeleted, false))

    // conver SQL string into number
    const totalCategoryCount = Number(categoryStats.totalCount ?? 0)
    const yesterdayCategoryCount = Number(categoryStats.yesterdayCount ?? 0)
    const lastWeekCategoryCount = Number(categoryStats.lastWeekCount ?? 0)
    const lastMonthCategoryCount = Number(categoryStats.lastMonthCount ?? 0)

    // map the result
    const CATEGORIES = "Categories" as const
    const productData: TDashboardData = {
        allTimeData: {
            name: CATEGORIES,
            totalValue: totalCategoryCount,
            progress: {
                trend: getProgressTrend(totalCategoryCount, yesterdayCategoryCount),
                value: yesterdayCategoryCount
            } 
        },
        thisWeekData: {
            name: CATEGORIES,
            totalValue: lastWeekCategoryCount,
            progress: {
                trend: getProgressTrend(totalCategoryCount, lastWeekCategoryCount),
                value: lastWeekCategoryCount
            }
        },
        thisMonthData: {
            name: CATEGORIES,
            totalValue: lastMonthCategoryCount,
            progress: {
                trend: getProgressTrend(totalCategoryCount, lastMonthCategoryCount),
                value: lastMonthCategoryCount
            }
        }
    }

    return Result.success(productData)
}

//--- get active product aggregate ------
async function getActiveProductAggregateDataAsync(): Promise<Result<TDashboardData>> {
    // yesterday to today range
    const startOfToday = metricTime.rangeBetweenTodayAndYesterday().startOfToday
    const startOfYesterday = metricTime.rangeBetweenTodayAndYesterday().startOfYesterday

    // last to current week range
    const startOfCurrentWeek = metricTime.rangeBetweenCurrentWeekAndLastWeek().startOfCurrentWeek
    const startOfLastWeek = metricTime.rangeBetweenCurrentWeekAndLastWeek().startOfLastWeek

    // last to current month range
    const startOfCurrentMonth = metricTime.rangeBetweenCurrentMonthAndLastMonth().startOfCurrentMonth
    const startOfLastMonth = metricTime.rangeBetweenCurrentMonthAndLastMonth().startOfLastMonth

    const [productStats] = await db
        .select({
            totalCount: sql<number>`COUNT (*)`,
            yesterdayCount: sql<number>`
                SUM(CASE 
                    WHEN ${products.createdAt} >= ${startOfYesterday} AND ${products.createdAt} <= ${startOfToday} 
                    THEN 1 
                    ELSE 0 
                END)`, 
            lastWeekCount: sql<number>`
                SUM(CASE
                    WHEN ${products.createdAt} >= ${startOfLastWeek} AND ${products.createdAt} <= ${startOfCurrentWeek}
                    THEN 1
                    ELSE 0
                END)`,
            lastMonthCount: sql<number>`
                SUM(CASE
                    WHEN ${products.createdAt} >= ${startOfLastMonth} AND ${products.createdAt} <= ${startOfCurrentMonth}
                    THEN 1
                    ELSE 0
                END)`
        })
        .from(products)
        .where(and(
            eq(products.isSoftDeleted, false),
            eq(products.isActive, true)
        ))

    // conver SQL string into number
    const totalProductCount = Number(productStats.totalCount ?? 0)
    const yesterdayProductCount = Number(productStats.yesterdayCount ?? 0)
    const lastWeekProductCount = Number(productStats.lastWeekCount ?? 0)
    const lastMonthProductCount = Number(productStats.lastMonthCount ?? 0)

    // map the result
    const ACTIVE_PRODUCTS = "Active Products" as const
    const productData: TDashboardData = {
        allTimeData: {
            name: ACTIVE_PRODUCTS,
            totalValue: totalProductCount,
            progress: {
                trend: getProgressTrend(totalProductCount, yesterdayProductCount),
                value: yesterdayProductCount
            } 
        },
        thisWeekData: {
            name: ACTIVE_PRODUCTS,
            totalValue: lastWeekProductCount,
            progress: {
                trend: getProgressTrend(totalProductCount, lastWeekProductCount),
                value: lastWeekProductCount
            }
        },
        thisMonthData: {
            name: ACTIVE_PRODUCTS,
            totalValue: lastMonthProductCount,
            progress: {
                trend: getProgressTrend(totalProductCount, lastMonthProductCount),
                value: lastMonthProductCount
            }
        }
    }

    return Result.success(productData)
}