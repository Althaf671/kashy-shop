<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import Chart from "$lib/components/ui/chart/Chart.svelte";
	import Dropdown from "$lib/components/ui/dropdown/Dropdown.svelte";
	import Table from "$lib/components/ui/table/Table.svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context.js";
	import { Button, Heading } from "flowbite-svelte";
	import { CalendarMonthOutline, ChevronDownOutline, DownloadSolid } from "flowbite-svelte-icons";
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

    // metric time range filter
    let selectedRange = $state('All Time');
    let isDropdownOpen = $state(false);
    const options = ['All Time', 'Last Week', 'Last Month'];

</script>

<main class="shop__management">

    <!-- filter and export -->
    <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-center w-full">
        
        <Heading tag="h2" class="text-xl md:text-2xl font-[600] text-[#1a1c23]">
            Good {getTimeOfDay()}, Kashley
        </Heading>

        <div class="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end flex-wrap">
            
            <!-- Button All Time -->            
            <Dropdown 
                bind:isOpen={isDropdownOpen} 
                bind:selected={selectedRange} 
                options={options}
            >
                <svelte:fragment slot="trigger">
                    <Button class="px-3 py-2 flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white hover:bg-gray-50 cursor-pointer text-[#636363] whitespace-nowrap text-sm shadow-xs">
                        <CalendarMonthOutline class="mr-1.5 h-4 w-4 text-[#7d7d7d]" />
                        {selectedRange}
                        <ChevronDownOutline class="ml-1.5 h-4 w-4 text-[#7d7d7d]" />
                    </Button>
                </svelte:fragment>
            </Dropdown>
            
            <!-- Button Export CSV -->
            <Button class="px-3 py-2 flex items-center gap-1.5 bg-[#996087] text-[#f4f3ee] hover:bg-[#824C71] cursor-pointer rounded-lg whitespace-nowrap text-sm shadow-xs">
                <DownloadSolid class="mr-1.5 h-4.5 w-4.5" />
                Export CSV
            </Button>
            
        </div>
    </div>

    <!-- metric panel -->
    <div class="metric-panel">
       {#each data.metrics as metric (metric)}
            <Card content={metric} />
       {/each}
    </div>

    <!-- chart and quick action -->
    <div class="chart-container">
        <div class="bar-chart bg-base-100 card-sm shadow-none rounded-sm">
            <Chart options={{ type: 'bar' }} />
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