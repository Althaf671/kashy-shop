export type TTrend = "up" | "neutral" | "down";

export type TDashboardData = {
    thisWeekData?: {
        name: string;
        totalValue: number;
        progress: {
            trend: TTrend;
            value: number;
        }
    },
    thisMonthData?: {
        name: string;
        totalValue: number;
        progress: {
            trend: TTrend;
            value: number;
        }
    },
    allTimeData?: {
        name: string;
        totalValue: number;
        progress: {
            trend: TTrend;
            value: number;
        }
    }
} 