import { getDashboardAggregateDataAsync } from "$lib/server/features/aggregate/dashboard.service";
import type { IUser } from "$lib/types/features";
import type { IMetricItem, TCardProps } from "$lib/types/global/ui.types";
import type { Actions } from "./$types";
import { getIconForMetric } from "$lib/utils/icon-manager";

export async function load()
    : Promise<{ metrics: TCardProps[], error?: unknown }> 
{
    //-- metric data and icon
    const metricData = await getDashboardAggregateDataAsync()
    console.log(metricData.error.description)
    if (metricData.isFailure) {
        return {
            metrics: [],
            error: metricData.error.description
        }
    }
    
    const metricProps: TCardProps[] = metricData.value.map((data) => ({
        type: "metric",
        item: { 
            name: data?.allTimeData?.name, 
            value: data?.allTimeData?.totalValue, 
            icon: getIconForMetric(data.allTimeData!.name),
            progress: { 
                value: data?.allTimeData?.progress.value,
                trend: data?.allTimeData?.progress.trend
            }
        } as IMetricItem 
    }))

    //-- chart data

    return { metrics: metricProps }
}

export const actions: Actions = {
    getMyData: async function getMyData(event) {
        return { user: event.locals.user } satisfies { user: IUser | null };
    },
}