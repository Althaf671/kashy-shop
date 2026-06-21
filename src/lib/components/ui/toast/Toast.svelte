<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import { CheckCircleSolid, CloseCircleSolid, InfoCircleSolid } from "flowbite-svelte-icons";
  import { page } from "$app/state"; 
  import { TOAST_TYPE } from "$lib/types/global/ui.types";
  import { fly } from "svelte/transition";

  let { data }: { data: App.PageData } = $props();

  let activeToast = $derived((page.form)?.reactiveToast || data.flashToast);
  let visible = $state(false);

  $effect(() => {
    if (activeToast) {
      visible = true;
      const timer = setTimeout(() => {
        visible = false;
      }, 5000);
      return () => clearTimeout(timer);
    }
  });
</script>

{#if visible && activeToast}
  <div transition:fly={{ x: 200, duration: 500 }} class="w-[350px]">
    {#if activeToast.type === TOAST_TYPE.SUCCESS}
      <Toast dismissable={true} color="green" iconClass="!rounded-full p-1.5">
        {#snippet icon()}
          <CheckCircleSolid class="h-5 w-5" />
        {/snippet}
        {activeToast.message}
      </Toast>
    {:else if activeToast.type === TOAST_TYPE.ERROR}
      <Toast dismissable={true} color="red" iconClass="!rounded-full p-1.5">
        {#snippet icon()}
          <CloseCircleSolid class="h-5 w-5" />
        {/snippet}
        {activeToast.message}
      </Toast>
    {:else}
      <Toast dismissable={true} color="blue" iconClass="!rounded-full p-1.5">
        {#snippet icon()}
          <InfoCircleSolid class="h-5 w-5" />
        {/snippet}
        {activeToast.message}
      </Toast>
    {/if}
  </div>
{/if}