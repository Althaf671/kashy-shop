<script lang="ts">
    import type { TCardProps } from "$lib/types/global/ui.types";
    import { SmileIcon } from "@hugeicons/core-free-icons";
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { Card, Span } from 'flowbite-svelte';
	import Skeleton from "../skeleton/Skeleton.svelte";

    // props from parent
    let { content, isLoading = false }: { 
      content: TCardProps, 
      isLoading: boolean } = $props()

</script>

{#if isLoading}
  <Skeleton type='card' />
{:else}
  {#if content.type === "metric"}
    <Card class="!p-0 w-full shadow-xs rounded-lg relative bg-white !max-w-none">
        <div class="card-body flex flex-col p-[0.75rem_0.95rem] h-[95px]">
              <div class="upper flex gap-3 h-[50px]">
                <div class="right flex flex-col">
                    <h2 class="card-title font-normal text-[0.89rem] text-[#7d7d7d]">{content.item.name}</h2>
                    <Span 
                        class="{content.item.name === 'Sales' && Number(content.item.value) >= 1000000000 
                            ? 'text-[1.8rem]' 
                            : content.item.name === 'Sales' && Number(content.item.value) > 99999 
                                ? 'text-[1.5rem] pt-[0.2rem]' 
                                : 'text-[1.8rem]'} font-[500]" 
                        style="margin-top: 8px;"
                    >
                        {content.item.name === 'Sales' 
                            ? (Number(content.item.value) >= 1000000000 
                                ? `Rp ${(Number(content.item.value) / 1000000000).toFixed(1).replace('.0', '')}M` 
                                : `Rp ${Number(content.item.value).toLocaleString('id-ID')}`) 
                            : content.item.value}
                    </Span>
                </div>
              </div>

              <HugeiconsIcon
                  icon={content.item.icon}
                  size={28}
                  color="#7d7d7d"
                  strokeWidth={1.35}
                  class="absolute right-3"
              />
          </div>

          <div class="lower flex items-center gap-2 border-t border-[rgba(128,128,128,0.3)] border-t-[0.5px] px-[0.95rem] py-[0.35rem] bg-[rgba(0,0,0,0.007)]">
              <p class="desc flex gap-[0.35rem] text-[0.75rem] text-[#7d7d7d]">
                {#if content.item.progress.trend === "up"}
                    <Span class="flex gap-[0.35rem] text-[0.75rem] text-[#7d7d7d]">
                      {content.item.progress.value} 
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#439a42" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="arrow-positive w-3 pt-1 mr-1"
                      >
                        <path d="M12 2L2 12H22L12 2Z" fill="#439a42" />
                      </svg>
                      from yesterday
                    </Span>
                {:else if content.item.progress.trend === "down"}
                    <Span class="flex gap-[0.35rem] text-[0.75rem] text-[#7d7d7d]">
                        {content.item.progress.value} 
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="red" 
                          stroke-width="2" 
                          stroke-linecap="round" 
                          stroke-linejoin="round"
                          class="arrow-negative w-3 pb-1 mr-1"
                        >
                          <path d="M12 22L22 12H2L12 22Z" fill="red" />
                        </svg>
                        from yesterday
                    </Span>
                {:else}
                    <Span class="neutral gap-[0.35rem] flex text-[0.75rem] text-[#7d7d7d]">
                      <HugeiconsIcon
                        icon={SmileIcon}
                        size={18}
                        color="#7d7d7d"
                        strokeWidth={1.5}
                        class="icon-wrapper mr-1"
                      />
                      nothings new
                    </Span>
                {/if}
              </p>
          </div>
      </Card>
  {:else if content.type === "action"}
      <div class="action-card">Action Card</div>
  {:else if content.type === "notification"}
      <div class="notification-card">Notification Card</div>
  {/if}
{/if}

<style>
  f {
    color: #439a42  }
</style>