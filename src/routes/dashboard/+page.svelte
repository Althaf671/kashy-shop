<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import { getContext } from "svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context";
	import Chart from "$lib/components/ui/chart/Chart.svelte";
	import Donut from "$lib/components/ui/chart/Donut.svelte";
	import Table from "$lib/components/ui/table/Table.svelte";
	import { Button, ButtonGroup, Heading } from "flowbite-svelte";
	import { CalendarMonthOutline, DownloadSolid } from "flowbite-svelte-icons";

    // header props
    const headerData: THeaderData = getContext(HEADER_KEY);
    $effect(() => {
        headerData.pageName = "Dashboard Overview";
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

<div class="dashboard__container">

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
            <Donut />
        </div>
    </div>

    <!-- order on progress and top sales -->
    <div class="table-container">
        <Table />
    </div>

    <!-- <ListGroup /> -->
</div>

<style>
    .dashboard__container {
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

    .table-container {
        display: flex;
        padding: 0;
        margin: 0;
        color: #7d7d7d;
    }
</style> 
