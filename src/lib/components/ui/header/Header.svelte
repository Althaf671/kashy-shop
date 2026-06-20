<script lang="ts">
    import { getContext, onDestroy } from 'svelte';
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { Notification01Icon } from '@hugeicons/core-free-icons';
    import { HEADER_KEY, type THeaderData } from '$lib/stores/global/context';
    import { Button, Heading } from 'flowbite-svelte';
	import { APP_COLORS } from '$lib/types/global/ui.types';
	import SearchBar from '../searchInput/SearchBar.svelte';

    // notification bind
    let { onToggle } = $props();

    // title props
    const header: THeaderData = getContext(HEADER_KEY);

    // clock
    let currentTime = $state("");
    let currentDate = $state("");

    function updateClock() {
        const now = new Date();
        
        currentTime = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit'
        }).replace(/:/g, '.'); 

        currentDate = now.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<header class="flex flex-col !w-full md:flex-row md:justify-between md:items-center py-4 md:py-4 bg-[${APP_COLORS.ACCENT_BACKGROUND}] border-b border-[rgba(128,128,128,0.3)] w-full gap-4 md:gap-0">
    
    <div class="flex flex-col gap-1">
        <Heading tag="h1" class="text-[1.6rem] md:text-[1.8rem] font-[600] text-[#1a1c23] m-0 tracking-[-0.5px] leading-[1.1] !mb-0" style="margin-top: 10px;">
            {header.pageName}
        </Heading>
        <p class="text-[0.85rem] md:text-[0.9rem] text-[#6b7280] m-0 font-normal">{header.description}</p>
    </div>

    <div class="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">

        <div class="text-[0.88rem] text-[#6b7280] font-medium flex items-center tracking-[-0.1px] gap-2">
            <span class="font-[600] text-[#1a1c23] tabular-nums">{currentTime}</span>
            <span class="text-[#d1d5db]">|</span>
            <span class="date-text">{currentDate}</span>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
            
            <SearchBar />

            <Button 
                onclick={onToggle} 
                class="action-btn !rounded-lg !bg-white !border !border-[#e5e7eb] !w-10 !h-10 !flex !items-center !justify-center !cursor-pointer transition-all duration-200 ease-in-out !shadow-[0_2px_6px_rgba(0,0,0,0.02)] !p-0 hover:!bg-[#f9fafb] hover:!border-[#d1d5db]" 
                title="Notifications"
            >
                <div class="relative flex items-center justify-center">
                    <HugeiconsIcon icon={Notification01Icon} size={20} color="#1a1c23" strokeWidth={1.8} />
                    <span class="absolute -top-[1px] right-0 w-[7px] h-[7px] bg-[#ef4444] rounded-full border border-white"></span>
                </div>
            </Button>
        </div>
    </div>
</header>