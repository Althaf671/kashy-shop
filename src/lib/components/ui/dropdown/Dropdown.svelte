<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment'; 
	import { Card } from 'flowbite-svelte';

    let { 
        isOpen = $bindable(false), 
        options = [], 
        selected = $bindable(), 
        onSelect = () => {}
    } = $props();

    let dropdownRef: HTMLDivElement;

    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    onMount(() => {
        if (browser) { 
            document.addEventListener('click', handleClickOutside);
        }
    });

    onDestroy(() => {
        if (browser) { 
            document.removeEventListener('click', handleClickOutside);
        }
    });
</script>

<div class="relative inline-block text-left" bind:this={dropdownRef}>
    <div onclick={() => isOpen = !isOpen}>
        <slot name="trigger" />
    </div>

    {#if isOpen}
        <Card style="margin-top: 5px;" class="absolute right-0 w-40 origin-top-right rounded-lg bg-white shadow-lg focus:outline-none z-50 overflow-hidden">
            <div>
                {#each options as option (option)}
                    <button
                        onclick={() => {
                            selected = option;
                            onSelect?.(option);
                            isOpen = false;
                        }}
                        class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors 
                        {selected === option ? 'bg-gray-100 text-gray-900 font-[500]' : 'text-gray-700'}"
                    >
                        {option}
                    </button>
                {/each}
            </div>
        </Card>
    {/if}
</div>