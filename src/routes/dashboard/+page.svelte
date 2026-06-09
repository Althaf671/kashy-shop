<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import { getContext } from "svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context";

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
