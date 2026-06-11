<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import { getContext } from "svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context";
	import Chart from "$lib/components/ui/chart/Chart.svelte";
	import Donut from "$lib/components/ui/chart/Donut.svelte";
	import Table from "$lib/components/ui/table/Table.svelte";

    // header props
    const headerData: THeaderData = getContext(HEADER_KEY);
    $effect(() => {
        headerData.pageName = "Dashboard Overview";
        headerData.description = "Manage your showcase gallery with ease.";
    });
    
    // metric data
    let { data } = $props()

</script>

<div class="dashboard__container">

    <!-- metric panel -->
    <div class="metric-panel">
       {#each data.metrics as metric (metric)}
            <Card content={metric} />
       {/each}
    </div>

    <!-- chart and quick action -->
    <div class="chart-container">
        <div class="bar-chart bg-base-100 card-sm shadow-sm rounded-none">
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
        padding-block: 1.5rem;
        gap: 2rem;
        height: auto;
    }

    .metric-panel {
        display: flex;
        gap: 1.5rem;
    }

    .chart-container {
        display: flex;
        justify-content: space-between;
        gap: 1.5rem;
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
    }
</style> 
