<script lang="ts">
	import type { TSkeletonType } from "$lib/types/global/ui.types";
	import { Card } from "flowbite-svelte";


    let { type }: { type: TSkeletonType } = $props()

</script>

{#if type === 'card'}
  <Card class="!p-0 w-96 shadow-xs rounded-lg relative bg-white !max-w-none animate-pulse">
      <div class="card-body flex flex-col p-[0.75rem_0.95rem] h-[95px]">
          <div class="upper flex gap-3 h-[50px]">
            <div class="right flex flex-col gap-2">
                <div class="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mt-1"></div>
            </div>
          </div>

          <div class="absolute right-3 top-4 w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
      </div>

      <div class="lower flex items-center border-t border-[rgba(128,128,128,0.3)] border-t-[0.5px] px-[0.95rem] py-[0.55rem] bg-[rgba(0,0,0,0.007)]">
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
  </Card>
{:else if type === 'banner'}
    <Card class="w-full bg-white border border-[rgba(128,128,128,0.15)] rounded-xl overflow-hidden shadow-xs animate-pulse">
        
        <div class="w-full h-48 sm:h-56 md:h-60 bg-gray-200"></div>

        <div class="px-6 pb-5 pt-2 flex justify-between items-center relative bg-white">
            
            <div class="flex items-center gap-4">
                
                <div 
                    class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 border-4 border-white sm:-mt-14 relative z-10 shadow-sm"
                    style="margin-top: -3rem;"></div>
                
                <div class="flex flex-col gap-2.5 mt-1">
                    <div class="h-5 bg-gray-200 rounded w-40 sm:w-48"></div>
                    <div class="h-3.5 bg-gray-200 rounded w-48 sm:w-56"></div>
                </div>

            </div>

            <div class="self-center">
                <div class="h-9 bg-gray-200 rounded-lg w-20"></div>
            </div>

        </div>

    </Card>
{:else if type === 'donut-chart'}
  <Card class="p-4 md:p-6 h-[47.8vh] bg-white shadow-xs rounded-lg flex flex-col justify-between animate-pulse">
    
    <div class="flex w-full items-start justify-between">
      <div class="flex items-center gap-2 mb-1">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
        <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>

    <div class="flex justify-center items-center my-auto py-2">
      <div class="w-44 h-44 rounded-full border-[16px] border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2">
        <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>

    <div class="flex items-center justify-center gap-6 mb-2">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
      <div class="flex items-center justify-between">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
      </div>
    </div>

  </Card>
{:else if type === 'bar-chart'}
  <Card class="p-4 md:p-6 bg-white shadow-xs rounded-lg w-full overflow-hidden min-w-0 animate-pulse"> 
    
    <div class="mb-4 flex justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="me-3 h-12 w-12 rounded-sm bg-gray-200 dark:bg-gray-700"></div>
        <div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        </div>
      </div>
      <div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-16"></div>
      </div>
    </div>

    <div class="grid grid-cols-2 pt-3">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 justify-self-end"></div>
    </div>

    <div class="w-full h-[180px] my-4 flex items-end justify-between px-4 pb-2 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-end gap-1"><div class="w-3 h-12 bg-gray-200 dark:bg-gray-700 rounded-t-sm"></div><div class="w-3 h-20 bg-gray-300 dark:bg-gray-600 rounded-t-sm"></div></div>
      <div class="flex items-end gap-1"><div class="w-3 h-4 bg-gray-200 dark:bg-gray-700 rounded-t-sm"></div><div class="w-3 h-28 bg-gray-300 dark:bg-gray-600 rounded-t-sm"></div></div>
      <div class="flex items-end gap-1"><div class="w-3 h-8 bg-gray-200 dark:bg-gray-700 rounded-t-sm"></div><div class="w-3 h-16 bg-gray-300 dark:bg-gray-600 rounded-t-sm"></div></div>
      <div class="flex items-end gap-1"><div class="w-3 h-14 bg-gray-200 dark:bg-gray-700 rounded-t-sm"></div><div class="w-3 h-24 bg-gray-300 dark:bg-gray-600 rounded-t-sm"></div></div>
      <div class="flex items-end gap-1"><div class="w-3 h-18 bg-gray-200 dark:bg-gray-700 rounded-t-sm"></div><div class="w-3 h-32 bg-gray-300 dark:bg-gray-600 rounded-t-sm"></div></div>
      <div class="flex items-end gap-1"><div class="w-3 h-6 bg-gray-200 dark:bg-gray-700 rounded-t-sm"></div><div class="w-3 h-14 bg-gray-300 dark:bg-gray-600 rounded-t-sm"></div></div>
    </div>

    <div class="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between pt-5">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
      </div>
    </div>

  </Card>
{:else if type === 'heading'}

{:else if type === 'paragraf'}

{/if}
