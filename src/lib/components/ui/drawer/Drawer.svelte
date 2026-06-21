<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import type { TDrawerType } from '$lib/types/global/ui.types';
    import { CloseCircleOutline } from 'flowbite-svelte-icons';
	import PatchProfileForm from '../forms/patchProfileForm/PatchProfileForm.svelte';
	import CreateCategoryForm from '../forms/createCategoryForm/CreateCategoryForm.svelte';
	import { getDrawerTitle } from '$lib/utils/drawer';
	import { drawer } from '$lib/stores/global/drawer.svelte';

    // State props
    let { open = $bindable(), type }: { open: boolean, type: TDrawerType } = $props()
    let updating = $state(false)
</script>

{#if open}
    <button 
        type="button"
        onclick={() => !updating && (open = false)} 
        transition:fade={{ duration: 300 }}
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
        aria-label="Close drawer"
        disabled={updating}
    ></button>

    <div 
        transition:fly={{ x: 350, duration: 300, easing: quintOut }}
        class="fixed top-0 right-0 z-50 h-full w-[385px] bg-white shadow-2xl flex flex-col"
    >
        <div class="px-7 py-2.5 border-b border-gray-100 shrink-0">
            <div class="flex justify-between items-start mb-2">
                <h2 class="text-xl font-[600] text-gray-900">
                    {getDrawerTitle(drawer.type)}
                </h2>
                <button 
                    onclick={() => open = false} 
                    disabled={updating}
                    class="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <CloseCircleOutline size="lg" />
                </button>
            </div>
            <p class="text-sm text-gray-500">{drawer.description}</p>
        </div>

        <div class="flex-1 overflow-y-auto px-7 py-4">
            {#if type === 'notification'}
                <div class="text-gray-500">No new notifications</div>
            {:else if type === 'patch-profile-form'}
                <PatchProfileForm bind:open={open} />
            {:else if type === 'create-category-form'}
                <CreateCategoryForm bind:open={open} />
            {/if}
        </div>
    </div>
{/if}