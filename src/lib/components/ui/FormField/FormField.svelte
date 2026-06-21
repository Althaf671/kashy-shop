<script lang="ts">
    /**
     * @file FormField.svelte
     * @description Universal form field component — raw HTML, Tailwind, Svelte 5.
     * Supports text, email, tel, password, date, textarea, file (single & multi),
     * and honeypot. Zero Flowbite dependency.
     *
     * --- Multi-file usage (new) ---
     * @example
     * <FormField
     *   label="Product Images"
     *   id="productImages"
     *   name="productImages"
     *   type="file"
     *   accept=".jpg,.png,.jpeg"
     *   multiple
     *   maxFiles={5}
     *   hint="Up to 5 images. PNG, JPG or JPEG."
     *   onFileChange={handleProductImagesChange}
     *   croppedFiles={croppedFiles}
     *   error={formErrors?.productImages}
     *   disabled={updating}
     * />
     *
     * --- Single-file usage (unchanged) ---
     * @example
     * <FormField
     *   label="Avatar Picture"
     *   id="avatarPicture"
     *   name="avatarPicture"
     *   type="file"
     *   accept=".jpg,.png,.jpeg"
     *   hint="PNG, JPG or JPEG."
     *   bind:files={avatarFiles}
     *   bind:inputRef={avatarInputRef}
     *   onFileChange={handleAvatarChange}
     *   error={formErrors?.avatarPicture}
     *   disabled={updating}
     * />
     */

    import type { Snippet } from 'svelte';

    // ─── Props ────────────────────────────────────────────────────────────────

    let {
        /** Visible label text rendered above the field. */
        label,

        /** HTML `id` — ties `<label for>` to the input. */
        id,

        /** HTML `name` — used in form submission. */
        name,

        /**
         * Input type.
         * - `'text'` | `'email'` | `'tel'` | `'password'` — single-line
         * - `'date'`     — native date picker
         * - `'textarea'` — multi-line
         * - `'file'`     — file picker (single or multi via `multiple` prop)
         * - `'honeypot'` — off-screen spam trap
         * @default 'text'
         */
        type = 'text',

        /** Bound value for single-line inputs and date. */
        value = $bindable(''),

        /** Bound value for `type="textarea"`. Kept separate to avoid prop collision. */
        textareaValue = $bindable(''),

        /** Placeholder text. */
        placeholder = '',

        /**
         * Validation error. Truthy → red border + message below.
         * @default null
         */
        error = null as string | null | undefined,

        /** Helper text shown in gray below the input. Hidden when `error` is truthy. */
        hint = '' as string,

        /** Disables all interaction and mutes visual appearance. @default false */
        disabled = false,

        /** Visible row count for `type="textarea"`. @default 3 */
        rows = 3,

        /** File MIME / extension filter. E.g. `".jpg,.png,.jpeg"`. */
        accept = '',

        /**
         * Allows picking multiple files at once.
         * When true, the trigger button label reflects the count of croppedFiles.
         * @default false
         */
        multiple = false,

        /**
         * Maximum number of files allowed when `multiple=true`.
         * Shown in the hint if provided.
         * @default 5
         */
        maxFiles = 5,

        /**
         * Bindable FileList for single-file mode.
         * Not used in multi-file mode — use `croppedFiles` instead.
         */
        files = $bindable(null as FileList | null),

        /**
         * Bindable ref to the hidden `<input type="file">`.
         * Parent injects the cropped FileList here after crop completes.
         */
        inputRef = $bindable(null as HTMLInputElement | null),

        /**
         * For multi-file mode: the array of already-cropped File objects.
         * FormField uses this only for display (label + chip list).
         * The parent manages this array entirely.
         */
        croppedFiles = [] as File[],

        /**
         * Callback fired on file input `change`.
         * - Single mode: parent opens crop modal for the one file.
         * - Multi mode: parent receives all files, builds crop queue.
         */
        onFileChange = null as ((e: Event) => void) | null,

        /**
         * Multi-file only: called when the user wants to remove a
         * specific already-cropped file by index.
         */
        onRemoveFile = null as ((index: number) => void) | null,

        /** Optional leading icon snippet for single-line inputs. */
        icon = undefined as Snippet | undefined,

        /** Extra Tailwind classes forwarded to the outermost wrapper `<div>`. */
        class: customClass = '',
    }: {
        label: string;
        id: string;
        name: string;
        type?: 'text' | 'email' | 'tel' | 'password' | 'date' | 'textarea' | 'file' | 'honeypot';
        value?: string;
        textareaValue?: string;
        placeholder?: string;
        error?: string | null | undefined;
        hint?: string;
        disabled?: boolean;
        rows?: number;
        accept?: string;
        multiple?: boolean;
        maxFiles?: number;
        files?: FileList | null;
        inputRef?: HTMLInputElement | null;
        croppedFiles?: File[];
        onFileChange?: ((e: Event) => void) | null;
        onRemoveFile?: ((index: number) => void) | null;
        icon?: Snippet;
        class?: string;
    } = $props();

    // ─── Derived ──────────────────────────────────────────────────────────────

    const hasError = $derived(!!error);

    /**
     * Label shown inside the file trigger button.
     * - Multi mode: shows count of cropped files vs max, e.g. "2 / 5 images selected"
     * - Single mode: shows filename or fallback placeholder
     */
    const fileLabel = $derived(
        multiple
            ? croppedFiles.length > 0
                ? `${croppedFiles.length} / ${maxFiles} images selected`
                : `Choose up to ${maxFiles} images`
            : files && files.length > 0
                ? files[0].name
                : `Choose ${label.toLowerCase()}`
    );

    /** Whether the file trigger button should be disabled. */
    const fileTriggerDisabled = $derived(
        disabled || (multiple && croppedFiles.length >= maxFiles)
    );

    // ─── Shared class builder ─────────────────────────────────────────────────

    const baseInputClass = $derived([
        'w-full px-3.5 py-2.5 text-sm',
        'rounded-xl',
        'bg-gray-100 text-gray-900 placeholder:text-gray-400',
        'border',
        hasError ? 'border-red-400' : 'border-gray-200',
        'outline-none transition-all duration-150',
        hasError
            ? 'focus:ring-2 focus:ring-red-400/20 focus:border-red-400'
            : 'focus:ring-2 focus:ring-[#996087]/20 focus:border-[#996087]',
        'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
    ].join(' '));
</script>

<!-- ─── Honeypot ─────────────────────────────────────────────────────────── -->
{#if type === 'honeypot'}
    <div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
        <input {id} {name} type="text" tabindex="-1" autocomplete="off" />
    </div>

<!-- ─── Visible fields ───────────────────────────────────────────────────── -->
{:else}
    <div class={customClass}>

        <!-- Label -->
        <label
            for={id}
            class="block mb-[5px] text-sm font-semibold {hasError ? 'text-red-500' : 'text-gray-900'}"
        >
            {label}
        </label>

        <!-- ── Text / Email / Tel / Password ── -->
        {#if type === 'text' || type === 'email' || type === 'tel' || type === 'password'}
            <div class="relative flex items-center">
                {#if icon}
                    <span class="pointer-events-none absolute left-3.5 flex items-center text-gray-400">
                        {@render icon()}
                    </span>
                {/if}
                <input
                    {id}
                    {name}
                    {type}
                    {placeholder}
                    {disabled}
                    bind:value
                    class="{baseInputClass} {icon ? 'pl-10' : 'pl-3.5'}"
                />
            </div>

        <!-- ── Date ── -->
        {:else if type === 'date'}
            <input
                {id}
                {name}
                type="date"
                {disabled}
                bind:value
                class={baseInputClass}
            />

        <!-- ── Textarea ── -->
        {:else if type === 'textarea'}
            <textarea
                {id}
                {name}
                {placeholder}
                {rows}
                {disabled}
                bind:value={textareaValue}
                class="{baseInputClass} resize-none leading-relaxed"
            ></textarea>

        <!-- ── File ── -->
        {:else if type === 'file'}
            <!-- Hidden native file input -->
            {#if multiple}
                <input
                    {id}
                    {name}
                    type="file"
                    {accept}
                    {disabled}
                    multiple={multiple}
                    bind:this={inputRef}
                    onchange={onFileChange ?? undefined}
                    class="sr-only"
                    tabindex="-1"
                    aria-hidden="true"
                />
            {:else}
                <input
                    {id}
                    {name}
                    type="file"
                    {accept}
                    {disabled}
                    multiple={multiple}
                    bind:this={inputRef}
                    bind:files
                    onchange={onFileChange ?? undefined}
                    class="sr-only"
                    tabindex="-1"
                    aria-hidden="true"
                />
            {/if}
            <!-- Styled trigger button -->
            <button
                type="button"
                onclick={() => inputRef?.click()}
                disabled={fileTriggerDisabled}
                aria-label="Choose {label}"
                class="
                    w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left
                    rounded-xl border bg-gray-100 transition-all duration-150 outline-none
                    {hasError
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                        : 'border-gray-200 focus:ring-2 focus:ring-[#996087]/20 focus:border-[#996087]'}
                    disabled:bg-gray-50 disabled:cursor-not-allowed
                "
            >
                <!-- Upload icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4.5 w-4.5 shrink-0 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                >
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                </svg>
                <span class="truncate {(multiple ? croppedFiles.length > 0 : files && files.length > 0) ? 'text-gray-900' : 'text-gray-400'}">
                    {fileLabel}
                </span>
            </button>

            <!-- ── Multi-file chip list ── -->
            {#if multiple && croppedFiles.length > 0}
                <ul class="mt-2 flex flex-col gap-1" aria-label="Selected images">
                    {#each croppedFiles as file, i (file)}
                        <li class="flex items-center justify-between gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700">
                            <!-- File icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="flex-1 truncate">{file.name}</span>
                            <!-- Remove button -->
                            {#if onRemoveFile && !disabled}
                                <button
                                    type="button"
                                    onclick={() => onRemoveFile?.(i)}
                                    aria-label="Remove {file.name}"
                                    class="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {/if}
        {/if}

        <!-- Hint -->
        {#if hint && !hasError}
            <p class="mt-1 text-xs text-gray-400">{hint}</p>
        {/if}

        <!-- Error -->
        {#if hasError}
            <p class="mt-1.5 text-xs text-red-500">{error}</p>
        {/if}

    </div>
{/if}