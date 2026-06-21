<script lang="ts">
    import type { TCardProps } from "$lib/types/global/ui.types";
    import { 
        ChevronDownIcon, 
        ChevronUpIcon, 
        ComputerPhoneSyncIcon, 
        LaptopIcon, 
        Logout01Icon, 
        SmartPhone02Icon, 
        SmileIcon, 
        Tablet01Icon 
    } from "@hugeicons/core-free-icons";
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { Card, Span } from 'flowbite-svelte';
	import Skeleton from "../skeleton/Skeleton.svelte";
	import Button from "../button/Button.svelte";
	import { slide } from "svelte/transition";

    // props from parent
    let { content, isLoading = false }: { 
      content: TCardProps, 
      isLoading: boolean } = $props()

    // get device type
    function getDeviceIcon(item: { device: string, os: string }) {
        const info = (item.device + " " + item.os).toLowerCase();
        
        if (info.includes("ipad") || info.includes("tablet")) return Tablet01Icon;
        if (info.includes("mobile") || info.includes("ios") || info.includes("android")) return SmartPhone02Icon;
        if (info.includes("pc") || info.includes("windows") || info.includes("mac") || info.includes("laptop")) return LaptopIcon;
        
        return ComputerPhoneSyncIcon; 
    }

    // modal of session details
    let isSessionExpanded = $state(false);
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
  {:else if content.type === 'session'}
    <Card class="flex flex-col border border-gray-100 shadow-xs rounded-md px-3 py-2.5 gap-0 transition-all">
        <div class="flex flex-row items-center gap-3 w-full">
            <div class="flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 shrink-0">
                <HugeiconsIcon icon={getDeviceIcon(content.item)} size={28} color="#7d7d7d" strokeWidth={1.65} />
            </div>
            
            <div class="flex flex-col flex-grow">
                <h4 class="text-sm font-[500] text-gray-900">{content.item.device}</h4>
                <p class="text-[0.75rem] text-gray-500">{content.item.os} - {content.item.browser}</p>
                <p class="text-[0.75rem] text-gray-400">Expired in: {content.item.expiredAt}</p>
            </div>

            {#if isSessionExpanded}
                <Button variant="ghost" size="sm" onclick={() => isSessionExpanded = !isSessionExpanded} class="shrink-0">
                    {#snippet icon()}
                        <HugeiconsIcon icon={ChevronUpIcon} size={18} />
                    {/snippet}
                </Button>
            {:else}
                <Button variant="ghost" size="sm" onclick={() => isSessionExpanded = !isSessionExpanded} class="shrink-0">
                    {#snippet icon()}
                        <HugeiconsIcon icon={ChevronDownIcon} size={18} />
                    {/snippet}
                </Button>
            {/if}
        </div>

        {#if isSessionExpanded}
            <div transition:slide class="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3 animate-in fade-in duration-200">
                <div class="flex justify-between text-xs text-gray-600">
                    <span>IP Address:</span>
                    <span class="font-mono text-gray-900">{content.item.ipAddress || '127.0.0.1'}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                    <span>Last Active:</span>
                    <span class="font-mono text-gray-900">4 Hours ago</span>
                </div>
                <Button color="alternative" size="md">
                    {#snippet icon()}<HugeiconsIcon icon={Logout01Icon} size={16} />{/snippet}
                    Logout Device
                </Button>
            </div>
        {/if}
    </Card>
  {/if}
{/if}
