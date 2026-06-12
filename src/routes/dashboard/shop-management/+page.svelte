<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import Chart from "$lib/components/ui/chart/Chart.svelte";
	import Table from "$lib/components/ui/table/Table.svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context.js";
	import { Button, ButtonGroup, Heading } from "flowbite-svelte";
	import { CalendarMonthOutline, DownloadSolid } from "flowbite-svelte-icons";
	import { getContext } from "svelte";

    // header props
    const headerData: THeaderData = getContext(HEADER_KEY)
    $effect(() => {
        headerData.pageName = "Shop Management";
        headerData.description = "View all of your business summary.";
    });
    
    // metric data
    let { data } = $props()

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
</script>

<main class="shop__management">

    <!-- filter and export -->
    <div class="flex justify-between items-center">
        <Heading tag="h2" class="text-2xl font-[600]">Good {getTimeOfDay()}, Kashley</Heading>

        <ButtonGroup class="rounded-none shadow-none gap-3 justify-end">
            <Button class="px-3 flex gap-1 rounded-md hover:bg-blue cursor-pointer text-[#636363]" >
                <CalendarMonthOutline class="me-2 h-4.5 w-4.5 text-[#7d7d7d]" />
                Date Range
            </Button>
            <Button class="px-3 flex gap-1.5 bg-[#824C71] text-[#f4f3ee] hover:bg-[#824C71] cursor-pointer rounded-md">
                <DownloadSolid class="me-2 h-4.5 w-4.5" />
                Export CSV
            </Button>
        </ButtonGroup>
    </div>

    <!-- metric panel -->
    <div class="metric-panel">
       {#each data.metrics as metric (metric)}
            <Card content={metric} />
       {/each}
    </div>

    <!-- chart and quick action -->
    <div class="chart-container">
        <div class="bar-chart bg-base-100 card-sm shadow-sm rounded-sm">
            <Chart />
        </div>
        <div class="donut-chart">
            
        </div>
    </div>

    <div class="table-container">
        <Table />
    </div>

</main>

<style>
    .shop__management {
        display: flex;
        flex-direction: column;
        padding-top: 1.5rem;
        gap: 1rem;
        height: auto;
        background-color: #f4f3ee;
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
</style>