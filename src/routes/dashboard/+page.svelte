<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import type { IMetricItem, TCardProps } from "$lib/types/global/ui.types";
	import { DashboardCircleIcon, DeliverySent01Icon, EuroCircleIcon, Package02Icon } from "@hugeicons/core-free-icons";
	import { getContext } from "svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context";

    // header props
    const headerData: THeaderData = getContext(HEADER_KEY);
    $effect(() => {
        headerData.pageName = "Dashboard Overview";
        headerData.description = "Manage your showcase gallery with ease.";
    });
    
    // metric data
    // let { data }: { data: PageData & { user: IUser | null } } = $props();
    // let user = $derived(data.user) 

    let metricData: TCardProps[] = [
        {
            type: "metric",
            item: { 
                name: 'Profit', 
                value: "800K", 
                icon: EuroCircleIcon,
                progress: { 
                    value: 1,
                    trend: "up"
                }
            } as IMetricItem 
        },
        {
            type: "metric",
            item: { 
                name: 'Categories', 
                value: 4, 
                icon: DashboardCircleIcon,
                progress: { 
                    value: 1,
                    trend: "down"
                }
            } as IMetricItem 
        },
        {
            type: "metric",
            item: { 
                name: 'Products', 
                value: 22, 
                icon: Package02Icon,
                progress: { 
                    value: 5,
                    trend: "up"
                }
            } as IMetricItem 
        },
        {
            type: "metric",
            item: { 
                name: 'Sales', 
                value: 19, 
                icon: DeliverySent01Icon,
                progress: { 
                    value: 3,
                    trend: "up"
                }
            } as IMetricItem 
        },
    ]

</script>

<div class="dashboard__container">

    <!-- metric panel -->
    <div class="metric-panel">
       {#each metricData as metric (metric)}
            <Card content={metric} />
       {/each}
    </div>

    <!-- chart and quick action -->

    <!-- order on progress and top sales -->

</div>

<style>
    .dashboard__container {
        display: flex;
        flex-direction: column;
        padding-block: 1.5rem;
    }

    .metric-panel {
        display: flex;
        gap: 1.5rem;
    }
</style> 
