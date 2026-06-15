<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import { PaperPlaneOutline } from "flowbite-svelte-icons";

  let { data, error, type }: { 
    data: string, 
    error: string, 
    type: "success" | "error" } = $props()

</script>

{#if type === "success"}
  <Toast dismissable={true}>
    {#snippet icon()}
      <PaperPlaneOutline class="text-fg-brand h-5 w-5 rotate-45" />
    {/snippet}
    <div class="ps-4 text-sm font-normal">{data}</div>
  </Toast>
{:else if type === "error"}
  <Toast dismissable={true}>
    {#snippet icon()}
      <PaperPlaneOutline class="text-fg-brand h-5 w-5 rotate-45" />
    {/snippet}
    <div class="ps-4 text-sm font-normal">{error}</div>
  </Toast>
{:else}
  <Toast dismissable={true}>
    {#snippet icon()}
      <PaperPlaneOutline class="text-fg-brand h-5 w-5 rotate-45" />
    {/snippet}
    <div class="ps-4 text-sm font-normal">{data}</div>
  </Toast>
{/if}