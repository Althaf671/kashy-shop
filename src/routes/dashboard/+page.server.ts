import { getDashboardAggregateDataAsync } from "$lib/server/features/aggregate/dashboard.service";
import type { IUser } from "$lib/types/features";
import type { IMetricItem, TCardProps } from "$lib/types/global/ui.types";
import { DashboardCircleIcon, DeliverySent01Icon, EuroCircleIcon, Package02Icon } from "@hugeicons/core-free-icons";
import type { Actions, PageServerLoad } from "./$types";
import { Result } from "$lib";

export async function load(event: Parameters<PageServerLoad>[0]) {
    // return { user: event.locals.user } satisfies { user: IUser | null };

    const metricData = await getDashboardAggregateDataAsync()
    if (metricData.isFailure) return Result.failure(metricData.error)
    
    const metricProps: TCardProps[] = metricData.value.map((data) => ({
        type: "metric",
        item: { 
            name: data?.allTimeData?.name, 
            value: data?.allTimeData?.totalValue, 
            icon: DashboardCircleIcon,
            progress: { 
                value: data?.allTimeData?.progress.value,
                trend: data?.allTimeData?.progress.trend
            }
        } as IMetricItem 
    }))

    return {
        metrics: metricProps
    };
}

export const actions: Actions = {
    getMyData: async function getMyData(event) {
        return { user: event.locals.user } satisfies { user: IUser | null };
    },
}