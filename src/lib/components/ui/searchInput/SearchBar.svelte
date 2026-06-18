<script lang="ts">
    import { goto } from "$app/navigation";
    import { SearchIcon } from "@hugeicons/core-free-icons";
    import { HugeiconsIcon } from "@hugeicons/svelte";
    import { Card, Input } from "flowbite-svelte";
    
    const pages = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Shop", path: "/dashboard/shop-management" },
        { name: "Order", path: "/dashboard/order-management" },
        { name: "Customers", path: "/dashboard/customer-management" },
        { name: "Settings", path: "/dashboard/settings" }
    ];

    let searchQuery = $state('');
    let isFocused = $state(false);
    let selectedIndex = $state(-1); 

    let filteredPages = $derived(
        searchQuery 
            ? pages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : []
    );

    $effect(() => {
        if (searchQuery) selectedIndex = -1;
    });

    function navigate(path: string) {
        goto(path);
        searchQuery = '';
        isFocused = false;
        selectedIndex = -1;
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!isFocused || filteredPages.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filteredPages.length - 1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0) {
                navigate(filteredPages[selectedIndex].path);
            }
        } else if (e.key === "Escape") {
            isFocused = false;
            selectedIndex = -1;
        }
    }
</script>

<Card class="relative w-full md:w-[260px] shadow-none">
    <div class="search-box rounded-lg bg-white px-4 py-2 flex items-center gap-2 transition-all {isFocused ? 'ring-2 ring-[#996087] border-transparent' : ''}">
        <span class="flex items-center">
            <HugeiconsIcon icon={SearchIcon} size={22} color="currentColor" strokeWidth={1.65} />
        </span>
        <Input 
            type="text" 
            placeholder="Search pages..." 
            bind:value={searchQuery}
            onfocus={() => isFocused = true}
            onblur={() => setTimeout(() => isFocused = false, 200)} 
            onkeydown={handleKeyDown} 
            class="!border-none !outline-none !bg-transparent text-[0.88rem] text-[#1a1c23] !w-full !p-0 focus:ring-0 placeholder:text-[#9ca3af]"
        />
    </div>

    {#if isFocused && filteredPages.length > 0}
        <Card class="absolute flex flex-col gap-1 top-full left-0 mt-6 w-full bg-white rounded-lg shadow-none z-50 overflow-hidden">
            {#each filteredPages as page, i (page)}
                <button 
                    onclick={() => navigate(page.path)}
                    class="w-full text-left px-4 py-2 text-sm text-[#1a1c23] transition-colors 
                    {selectedIndex === i ? 'bg-gray-100' : 'hover:bg-gray-50'}"
                >
                    Go to <span class="font-[500]">{page.name}</span>
                </button>
            {/each}
        </Card>
    {/if}
</Card>