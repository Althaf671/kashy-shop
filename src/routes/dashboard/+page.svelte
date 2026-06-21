<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import { getContext } from "svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context";
	import Chart from "$lib/components/ui/chart/Chart.svelte";
	import { Heading } from "flowbite-svelte";
	import { CalendarMonthOutline, ChevronDownOutline, DownloadSolid } from "flowbite-svelte-icons";
    import { navigating } from "$app/state";
	import { APP_COLORS } from "$lib/types/global/ui.types.js";
	import Button from "$lib/components/ui/button/Button.svelte";

    // header props
    const headerData: THeaderData = getContext(HEADER_KEY);
    $effect(() => {
        headerData.pageName = "Dashboard Overview";
        headerData.description = "View all of your business summary.";
    });
    
    // metric data
    let { data } = $props()

    // loading state
    let isLoading = $derived(!!navigating.to)

    // get time of day
    function getTimeOfDay(): string {
        const currentHour = new Date(Date.now()).getHours();

        if (currentHour >= 6 && currentHour < 12) {
            return "Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    }

    // metric time range filter
    let selectedRange = $state('All Time');
    let isDropdownOpen = $state(false);
    const options = ['All Time', 'Last Week', 'Last Month'];

    // export CSV
    function exportCsv() {
        console.log("Exporting CSV...")
    }

    // filter metric
    function filterMetric() {
        console.log("Filtering metric...")
    }

    // dropdown state
    let open = $state(false)

</script>

<div class="dashboard__container bg-[{APP_COLORS.DARK_BACKGROUND}]">

    <!-- filter and export -->
    <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-center w-full">
        
        <Heading tag="h2" class="text-xl md:text-2xl font-[600] text-[#1a1c23]">
            Good {getTimeOfDay()}, Kashley
        </Heading>

        <div class="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end flex-wrap">
            
            <!-- Button All Time -->            
            <Button
                variant="secondary"
                ariaHaspopup="listbox"
                ariaExpanded={open}
                onclick={() => {
                    open = !open
                    filterMetric()
                }}
            >
              {#snippet icon()}<CalendarMonthOutline class="h-4 w-4 text-[#7d7d7d]" />{/snippet}
              {selectedRange}
              {#snippet trailingIcon()}<ChevronDownOutline class="h-4 w-4 text-[#7d7d7d]" />{/snippet}
            </Button>
            
            <!-- Button Export CSV -->
            <Button variant="primary" onclick={exportCsv}>
                {#snippet icon()}<DownloadSolid class="h-4.5 w-4.5" />{/snippet}
                Export CSV
            </Button>
            
        </div>
    </div>

    <!-- metric panel -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {#each data.metrics as metric (metric)}
            <Card content={metric} isLoading={isLoading} />
        {/each}
    </div>

    <!-- chart and quick action -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        <div class="lg:col-span-2 w-full">
            <Chart options={{ type: "bar" }} isLoading={isLoading} />
        </div>
        <div class="lg:col-span-1 w-full">
            <Chart options={{ type: "donut" }} isLoading={isLoading} />
        </div>
    </div>

    <!-- order on progress and top sales -->

    <!-- <ListGroup /> -->
</div>

<style>
    .dashboard__container {
        display: flex;
        flex-direction: column;
        padding-top: 1.5rem;
        gap: 1rem;
        height: auto;
    }

    .metric-panel {
        display: flex;
        gap: 1rem;
    }

    .chart-container {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: stretch;
    }

    .bar-chart {
        width: 70%;
        min-width: 0;
        position: relative; 
        overflow: hidden;  
        transition: width 3s ease-in-out;
    }

    .table-container {
        display: flex;
        padding: 0;
        margin: 0;
        color: #7d7d7d;
    }
</style> 
