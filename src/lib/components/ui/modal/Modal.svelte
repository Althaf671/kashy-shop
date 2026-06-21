<script lang="ts">
    /**
     * @file Modal.svelte
     * @description Universal modal component supporting three variants:
     *
     * - `'crop'`    — Image cropper powered by svelte-easy-crop. Used for
     *                 avatar (round/1:1) and banner (rect/16:9) uploads.
     * - `'info'`    — Informational dialog with a HugeIcon, message text,
     *                 and a single confirm button. E.g. cookie notice.
     * - `'confirm'` — Confirmation/warning dialog with a HugeIcon, message
     *                 text, and a single action button (danger style).
     *                 E.g. "You will be logged out immediately!".
     *
     * All variants share: dark overlay backdrop, centered card, rounded-xl,
     * shadow-xs, X close button, fade transition.
     *
     * @example — crop (avatar)
     * <Modal
     *   bind:show={showCropModal}
     *   type="crop"
     *   imageSrc={cropImageSrc}
     *   fileName={cropFileName}
     *   aspect={1}
     *   shape="round"
     *   onCropComplete={handleCropComplete}
     * />
     *
     * @example — info (cookie notice)
     * <Modal
     *   bind:show={showCookieModal}
     *   type="info"
     *   icon={CookieIcon}
     *   message="We use cookies for improving user experience, analytics and marketing."
     *   confirmLabel="That's fine!"
     *   onConfirm={acceptCookies}
     * />
     *
     * @example — confirm (logout warning)
     * <Modal
     *   bind:show={showLogoutModal}
     *   type="confirm"
     *   icon={AlarmIcon}
     *   message="You will be logged out immediately!"
     *   confirmLabel="Extend login"
     *   onConfirm={extendSession}
     * />
     */

    import type { Snippet } from 'svelte';
    import { fade } from 'svelte/transition';
    import { getCroppedImg, type CropArea } from '$lib/utils/cropImage';
    import Cropper, { type OnCropComplete } from 'svelte-easy-crop';
    import Button from '../button/Button.svelte';

    // ─── Types ────────────────────────────────────────────────────────────────
    type ModalType = 'crop' | 'info' | 'confirm';

    // ─── Props ────────────────────────────────────────────────────────────────
    let {
        /** Controls modal visibility. Bindable from parent. */
        show = $bindable(false),

        /**
         * Modal variant.
         * - `'crop'`    — image cropper
         * - `'info'`    — informational notice with single action
         * - `'confirm'` — warning/confirmation with action button
         * @default 'crop'
         */
        type = 'crop' as ModalType,

        // ── crop props ──────────────────────────────────────────────────────
        /** Source URL for the image to crop. Required for `type="crop"`. */
        imageSrc = '' as string,

        /** Original file name — used to generate the cropped file name. */
        fileName = 'image' as string,

        /** Aspect ratio for the crop area. @default 1 */
        aspect = 1 as number,

        /** Crop shape. @default 'rect' */
        shape = 'rect' as 'rect' | 'round',

        /** Callback receiving the cropped File after the user applies the crop. */
        onCropComplete = undefined as ((file: File) => void) | undefined,

        // ── info / confirm props ────────────────────────────────────────────

        /**
         * Svelte snippet rendering a HugeIcon (or any SVG).
         * Displayed centered above the message text.
         */
        icon = undefined as Snippet | undefined,

        /**
         * Body text shown below the icon.
         * Centered, `text-sm text-gray-700`, max-w constrained.
         */
        message = '' as string,

        /**
         * Label for the primary action button.
         * - `'info'`    → rendered as `variant="primary"`
         * - `'confirm'` → rendered as `variant="danger"`
         * @default 'OK'
         */
        confirmLabel = 'OK' as string,

        /**
         * Callback fired when the confirm button is clicked.
         * After calling this, `show` is set to `false` automatically.
         */
        onConfirm = undefined as (() => void) | undefined,
    }: {
        show: boolean;
        type?: ModalType;
        // crop
        imageSrc?: string;
        fileName?: string;
        aspect?: number;
        shape?: 'rect' | 'round';
        onCropComplete?: (file: File) => void;
        // info / confirm
        icon?: Snippet;
        message?: string;
        confirmLabel?: string;
        onConfirm?: () => void;
    } = $props();

    // ─── Crop state ───────────────────────────────────────────────────────────
    let crop = $state({ x: 0, y: 0 });
    let zoom = $state(1);
    let croppedPixels = $state<CropArea | null>(null);
    let cropLoading = $state(false);

    function handleCropComplete(event: Parameters<OnCropComplete>[0]) {
        croppedPixels = event.pixels;
    }

    async function saveCrop() {
        if (!croppedPixels || !imageSrc) return;
        try {
            cropLoading = true;
            const croppedBlob = await getCroppedImg(imageSrc, croppedPixels);
            const baseName = fileName.replace(/\.[^/.]+$/, '');
            const croppedFile = new File([croppedBlob], `${baseName}-cropped.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });
            onCropComplete?.(croppedFile);
            show = false;
        } catch (error) {
            console.error('Failed to crop image:', error);
        } finally {
            cropLoading = false;
        }
    }

    // ─── Info / Confirm handler ───────────────────────────────────────────────

    function handleConfirm() {
        onConfirm?.();
        show = false;
    }

    // ─── Close on backdrop click ──────────────────────────────────────────────

    function handleBackdropClick() {
        // Crop modal: do not close on backdrop click (user may lose crop state)
        if (type === 'crop') return;
        show = false;
    }
</script>

{#if show}
    <!-- ── Backdrop overlay ── -->
    <div
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={type === 'crop' ? 'Image crop dialog' : message}
    >
        <!-- Click backdrop to close (info/confirm only) -->
        <button
            type="button"
            class="absolute inset-0 w-full h-full cursor-default"
            aria-label="Close modal"
            tabindex="-1"
            onclick={handleBackdropClick}
        ></button>

        <!-- ── Modal card ── -->
        <div class="relative z-10 bg-white rounded-xl shadow-xs w-[50%] max-w-sm flex flex-col overflow-hidden">

            <!-- X close button — top right -->
            <button
                type="button"
                onclick={() => (show = false)}
                aria-label="Close"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <!-- ════════════════════════════════════════
                 CROP variant
            ════════════════════════════════════════ -->
            {#if type === 'crop'}
                <!-- Header -->
                <div class="px-4 pt-4 pb-3 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-semibold text-gray-900 text-sm">Adjust Your Image</h3>
                </div>

                <!-- Crop canvas -->
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

                <!-- Zoom + apply -->
                <div class="p-4 bg-white border-t border-gray-100 space-y-4">
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-gray-500 shrink-0">Zoom</span>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            bind:value={zoom}
                            class="w-full accent-[#996087]"
                            aria-label="Zoom level"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        fullWidth
                        loading={cropLoading}
                        loadingText="Processing..."
                        onclick={saveCrop}
                    >
                        Apply Crop
                    </Button>
                </div>

            <!-- ════════════════════════════════════════
                 INFO variant
            ════════════════════════════════════════ -->
            {:else if type === 'info'}
                <div class="flex flex-col items-center text-center px-6 pt-10 pb-6 gap-4">
                    {#if icon}
                        <span class="text-5xl flex items-center justify-center" aria-hidden="true">
                            {@render icon()}
                        </span>
                    {/if}
                    <p class="text-sm font-medium text-gray-800 leading-relaxed max-w-[260px]">
                        {message}
                    </p>
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onclick={handleConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </div>

            <!-- ════════════════════════════════════════
                 CONFIRM variant
            ════════════════════════════════════════ -->
            {:else if type === 'confirm'}
                <div class="flex flex-col items-center text-center px-6 pt-10 pb-6 gap-4">
                    {#if icon}
                        <span class="text-5xl flex items-center justify-center" aria-hidden="true">
                            {@render icon()}
                        </span>
                    {/if}
                    <p class="text-sm font-medium text-gray-800 leading-relaxed max-w-[260px]">
                        {message}
                    </p>
                    <Button
                        type="button"
                        variant="danger"
                        size="lg"
                        fullWidth
                        onclick={handleConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            {/if}

        </div>
    </div>
{/if}