<script lang="ts">
    import Cropper, { type OnCropComplete } from 'svelte-easy-crop';
    import { fade } from 'svelte/transition';
    import { getCroppedImg, type CropArea } from '$lib/utils/cropImage';
    import { Spinner } from 'flowbite-svelte';

    let { 
        show = $bindable(false), 
        imageSrc, 
        fileName = 'image',
        aspect = 1, 
        shape = 'rect',
        onCropComplete 
    }: { 
        show: boolean, 
        imageSrc: string, 
        fileName?: string,
        aspect: number, 
        shape: 'rect' | 'round',
        onCropComplete: (file: File) => void 
    } = $props();

    let crop = $state({ x: 0, y: 0 });
    let zoom = $state(1);
    let croppedPixels = $state<CropArea | null>(null);
    let loading = $state(false);

    function handleCropComplete(event: Parameters<OnCropComplete>[0]) {
        croppedPixels = event.pixels;
    }

    async function saveCrop() {
        if (!croppedPixels || !imageSrc) return;
        try {
            loading = true;
            const croppedBlob = await getCroppedImg(imageSrc, croppedPixels);
            
            const baseName = fileName.replace(/\.[^/.]+$/, '');
            const croppedFile = new File([croppedBlob], `${baseName}-cropped.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            onCropComplete(croppedFile);
            show = false;
        } catch (error) {
            console.error('Failed to crop image:', error);
        } finally {
            loading = false;
        }
    }
</script>

{#if show}
    <div transition:fade={{ duration: 200 }} class="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-white rounded-xl shadow-2xl w-[70vw] max-w-md flex flex-col overflow-hidden max-h-[90vh]">
            
            <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 class="font-semibold text-gray-900 text-base">Adjust Your Image</h3>
                <button type="button" onclick={() => show = false} class="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
            </div>

            <div style="position: relative; width: 100%; height: 300px; background: #111827;">
                <Cropper
                    image={imageSrc}
                    bind:crop
                    bind:zoom
                    {aspect}
                    cropShape={shape}
                    showGrid={false}
                    oncropcomplete={handleCropComplete}
                />
            </div>

            <div class="p-4 bg-white border-t border-gray-100 space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-xs text-gray-500">Zoom</span>
                    <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.1" 
                        bind:value={zoom} 
                        class="w-full accent-[#996087]" 
                    />
                </div>

                <div class="flex gap-2">
                    <button
                        type="button"
                        onclick={saveCrop}
                        disabled={loading}
                        class="w-full py-2 bg-[#996087] text-white text-sm font-medium rounded-lg hover:bg-[#855376] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {#if loading}
                            <Spinner size="4" color='primary' />
                            <span>Processing...</span>
                        {:else}
                            Apply Crop
                        {/if}
                    </button>
                </div>
            </div>

        </div>
    </div>
{/if}