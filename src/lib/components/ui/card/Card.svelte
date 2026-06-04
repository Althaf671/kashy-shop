<script lang="ts">
	import type { TCardTypes } from "$lib/types/global/ui.types";

    let { type } = $props<{ type: TCardTypes }>()
</script>

{#if type === "metric"}
    <div class="metric-card">Metric Card</div>
{:else if type === "standard"}
    <div class="standard-card">Standard Card</div>
{/if}