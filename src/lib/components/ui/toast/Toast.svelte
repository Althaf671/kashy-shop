<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import { 
    CheckCircleSolid, 
    CloseCircleSolid, 
    InfoCircleSolid 
  } from "flowbite-svelte-icons";
  import { page } from "$app/state"; 
	import { TOAST_TYPE } from "$lib/types/global/ui.types";
	import { fly } from "svelte/transition";

  let { data }: { data: App.PageData } = $props();

  let activeToast = $derived((page.form)?.reactiveToast || data.flashToast);
  
  let visible = $state(false);

  $effect(() => {
    if (activeToast) {
      visible = true
      const timer = setTimeout(() => {
        visible = false;
      }, 4000)

      return () => clearTimeout(timer);
    }
  });
</script>

{#if visible && activeToast}
  {#if activeToast.type === TOAST_TYPE.SUCCESS}
    <Toast transition={fly} params={{ x: 200 }} dismissable={true} color="green">
      {#snippet icon()}
        <CheckCircleSolid class="h-5 w-5" />
        <span class="sr-only">Check icon</span>
      {/snippet}
      {activeToast.message}
    </Toast>
  {:else if activeToast.type === TOAST_TYPE.ERROR}
    <Toast transition={fly} params={{ x: 200 }} dismissable={true} color="red">
      {#snippet icon()}
        <CloseCircleSolid class="h-5 w-5" />
        <span class="sr-only">Error icon</span>
      {/snippet}
      {activeToast.message}
    </Toast>
  {:else}
    <Toast transition={fly} params={{ x: 200 }} dismissable={true} color="blue">
      {#snippet icon()}
        <InfoCircleSolid class="h-5 w-5" />
        <span class="sr-only">Information icon</span>
      {/snippet}
      {activeToast.message}
    </Toast>
  {/if}
{/if}