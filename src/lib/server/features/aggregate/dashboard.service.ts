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

        console.log(JSON.stringify(categoryData))

        // get active product aggregate
        const productData = await getActiveProductAggregateDataAsync()
        if (productData.isFailure) return Result.failure(productData.error)

        console.log(JSON.stringify(productData))

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
    console.log("Running get category aggregate.")

    const [categoryStats] = await db
        .select({ 
            totalCount: sql<number>`COUNT (*)`,
            todayCount: sql<number>`SUM(CASE WHEN ${categories.createdAt} = ${metricTime.today} THEN 1 ELSE 0 END)`, 
            yesterdayCount: sql<number>`SUM(CASE WHEN ${categories.createdAt} > ${metricTime.oneDayAgo} THEN 1 ELSE 0 END)`,
            lastWeekCount: sql<number>`SUM(CASE WHEN ${categories.createdAt} > ${metricTime.oneWeekAgo} THEN 1 ELSE 0 END)`,
            lastMonthCount: sql<number>`SUM(CASE WHEN ${categories.createdAt} > ${metricTime.oneMonthAgo} THEN 1 ELSE 0 END)`
        })
        .from(categories)
        .where(eq(categories.isSoftDeleted, false))

    console.log("Receiving query category stats: ", JSON.stringify(categoryStats))

    // conver SQL string into number
    const totalCategoryCount = Number(categoryStats.totalCount ?? 0)
    const todayCategoryCount = Number(categoryStats.todayCount ?? 0)
    const yesterCategorydayCount = Number(categoryStats.yesterdayCount ?? 0)
    const lastWeekCategoryCount = Number(categoryStats.lastWeekCount ?? 0)
    const lastMonthCategoryCount = Number(categoryStats.lastMonthCount ?? 0)

    // map the result
    const categoryData: TDashboardData = {
        allTimeData: {
            name: "Categories",
            totalValue: totalCategoryCount,
            progress: {
                trend: getProgressTrend(todayCategoryCount, yesterCategorydayCount),
                value: yesterCategorydayCount
            }
        }
    }

    return Result.success(categoryData)
}

//--- get active product aggregate ------
async function getActiveProductAggregateDataAsync(): Promise<Result<TDashboardData>> {
    const [productStats] = await db
        .select({
            totalCount: sql<number>`COUNT (*)`,
            todayCount: sql<number>`SUM(CASE WHEN ${products.createdAt} = ${metricTime.today} THEN 1 ELSE 0 END)`, 
            yesterdayCount: sql<number>`COUNT (CASE WHEN ${products.createdAt} > ${metricTime.oneDayAgo} THEN 1 END)`,
            lastWeekCount: sql<number>`SUM(CASE WHEN ${products.createdAt} > ${metricTime.oneWeekAgo} THEN 1 ELSE 0 END)`,
            lastMonthCount: sql<number>`SUM(CASE WHEN ${products.createdAt} > ${metricTime.oneMonthAgo} THEN 1 ELSE 0 END)`
        })
        .from(products)
        .where(and(
            eq(products.isSoftDeleted, false),
            eq(products.isActive, true)
        ))

    // conver SQL string into number
    const totalProductCount = Number(productStats.totalCount ?? 0)
    const todayProductCount = Number(productStats.todayCount ?? 0)
    const yesterdayProductCount = Number(productStats.yesterdayCount ?? 0)
    const lastWeekProductCount = Number(productStats.lastWeekCount ?? 0)
    const lastMonthProductCount = Number(productStats.lastMonthCount ?? 0)

    // map the result
    const productData: TDashboardData = {
        allTimeData: {
            name: "Active Products",
            totalValue: totalProductCount,
            progress: {
                trend: getProgressTrend(todayProductCount, yesterdayProductCount),
                value: yesterdayProductCount
            } 
        }
    }

    return Result.success(productData)
}