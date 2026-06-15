<script lang="ts">
    import { getContext, onDestroy } from 'svelte';
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { Notification01Icon, Search01Icon } from '@hugeicons/core-free-icons';
    import { HEADER_KEY, type THeaderData } from '$lib/stores/global/context';
    import { Input, Button, Heading } from 'flowbite-svelte';

    // search
    let searchQuery = $state("");

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

<header class="flex justify-between items-center pb-4 pt-2.75 bg-transparent w-full max-h-[200px] border-b border-b-[0.5px] border-[rgba(128,128,128,0.3)] bg-[#f4f3ee] max-md:flex-col max-md:items-start max-md:gap-[1.25rem]">
    <div class="flex flex-col gap-[0.05rem] mt-[10px]">
        <Heading tag="h1" class="text-[1.8rem] font-bold text-[#1a1c23] m-0 tracking-[-0.5px] leading-[1.1] pt-[1.5rem] !mb-0">
            {header.pageName}
        </Heading>
        <p class="text-[0.9rem] text-[#6b7280] m-0 font-normal">{header.description}</p>
    </div>

    <div class="flex flex-col items-end gap-2 mt-[20px] max-md:w-full max-md:items-start">

        <div class="text-[0.88rem] text-[#6b7280] font-medium flex items-center tracking-[-0.1px] w-fit -mb-[3px] gap-[10px]">
            <span class="font-bold text-[#1a1c23] tabular-nums">{currentTime}</span>
            <span class="text-[#d1d5db]">|</span>
            <span class="date-text">{currentDate}</span>
        </div>

        <div class="flex items-center gap-[0.65rem] max-md:w-full">
            
            <div class="search-box rounded-lg bg-white border border-[#e5e7eb] px-[1rem] py-[0.55rem] flex items-center gap-[0.5rem] w-[260px] shadow-[0_2px_6px_rgba(0,0,0,0.02)] max-md:flex-1">
                <span class="flex items-center">
                    <HugeiconsIcon icon={Search01Icon} size={18} color="#9ca3af" strokeWidth={2} />
                </span>
                <Input 
                    type="text" 
                    placeholder="Search by keywords..." 
                    bind:value={searchQuery}
                    class="!border-none !outline-none !bg-transparent text-[0.88rem] text-[#1a1c23] !w-full !p-0 focus:ring-0 placeholder:text-[#9ca3af]"
                />
            </div>

            <Button 
                class="action-btn !rounded-lg !bg-white !border !border-[#e5e7eb] !w-[40px] !h-[40px] !flex !items-center !justify-center !cursor-pointer transition-all duration-200 ease-in-out !shadow-[0_2px_6px_rgba(0,0,0,0.02)] !p-0 hover:!bg-[#f9fafb] hover:!border-[#d1d5db]" 
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