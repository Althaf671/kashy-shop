import type { TTrend } from "$lib/types/features/dashboard.schema";

export function generateOrderCode(): string {
    const now = new Date()
    const datePart = now.toISOString().slice(0, 10).replaceAll(/-/g, '')
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase()
    const orderCode = `ORD-${datePart}-${randomPart}` as const
    return orderCode
}

// FULL OF BUGS FOR GOD'S SAKE
export function getProgressTrend(todayCount: number, yesterdayCount: number): TTrend {
    if (todayCount > yesterdayCount) return "up"
    if (todayCount < yesterdayCount) return "down"
    return "neutral"
}