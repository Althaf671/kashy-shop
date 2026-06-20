<script lang="ts">
    /**
     * @file FormField.svelte
     * @description A universal, reusable form field component built with raw HTML,
     * Tailwind CSS, and Svelte 5 runes. Replaces all Flowbite Input/Label/Helper
     * usage across the app. Supports text, email, tel, date, textarea, and file
     * (with optional crop-mode callback). Zero external UI dependencies.
     *
     * @example — text with icon
     * <FormField
     *   label="Fullname"
     *   id="name"
     *   name="name"
     *   type="text"
     *   placeholder="Kashley Vanrogoue"
     *   bind:value={nameValue}
     *   error={formErrors?.name}
     *   disabled={updating}
     * >
     *   {#snippet icon()}<UserIcon />{/snippet}
     * </FormField>
     *
     * @example — file with crop
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

        /** HTML `id` attribute — ties the <label> to the input via `for`. */
        id,

        /** HTML `name` attribute used when the field is inside a <form>. */
        name,

        /**
         * Input type. Accepted values:
         * - `'text'` | `'email'` | `'tel'` | `'password'` — single-line inputs
         * - `'date'`  — native date picker
         * - `'textarea'` — multi-line text area
         * - `'file'`  — file picker (renders a styled button, hides native input)
         * - `'honeypot'` — visually hidden spam-trap field
         * @default 'text'
         */
        type = 'text',

        /**
         * Bound string value for text-like inputs (`text`, `email`, `tel`,
         * `password`, `date`). Not used for `file` or `textarea`.
         */
        value = $bindable(''),

        /**
         * Bound string value specifically for `textarea` type.
         * Kept separate so the parent can bind independently.
         */
        textareaValue = $bindable(''),

        /** Placeholder text shown inside the input when empty. */
        placeholder = '',

        /**
         * Validation error message. When truthy the field border turns red
         * and the message is rendered below the input in red.
         * @default null
         */
        error = null as string | null | undefined,

        /**
         * Hint / helper text rendered below the input in gray.
         * Shown only when `error` is falsy.
         */
        hint = '' as string,

        /**
         * Whether the field is non-interactive. Applies `disabled` to the
         * underlying input and mutes its visual appearance.
         * @default false
         */
        disabled = false,

        /**
         * Number of visible rows for `type="textarea"`.
         * @default 3
         */
        rows = 3,

        /**
         * `accept` attribute forwarded to the hidden `<input type="file">`.
         * E.g. `".jpg,.png,.jpeg"`
         */
        accept = '',

        /**
         * Bindable `FileList` for `type="file"`. Bind this in the parent to
         * read which files the user selected (after optional crop processing).
         */
        files = $bindable(null as FileList | null),

        /**
         * Bindable ref to the hidden `<input type="file">` element.
         * The parent needs this to programmatically set `.files` after cropping.
         */
        inputRef = $bindable(null as HTMLInputElement | null),

        /**
         * Callback fired when the user picks a file (`type="file"` only).
         * Receives the native `Event` so the parent can open the crop modal,
         * revoke object URLs, etc.
         */
        onFileChange = null as ((e: Event) => void) | null,

        /**
         * Optional Svelte 5 snippet rendered as a leading icon inside the
         * input. Should render a single SVG icon element.
         * Not applicable for `date`, `textarea`, or `file` types.
         */
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
        files?: FileList | null;
        inputRef?: HTMLInputElement | null;
        onFileChange?: ((e: Event) => void) | null;
        icon?: Snippet;
        class?: string;
    } = $props();

    // ─── Derived ──────────────────────────────────────────────────────────────

    /** Display name for the chosen file, or fallback placeholder. */
    const fileLabel = $derived(
        files && files.length > 0 ? files[0].name : `Choose ${label.toLowerCase()}`
    );

    const hasError = $derived(!!error);

    // ─── Shared class builders ────────────────────────────────────────────────

    /**
     * Base classes shared by all input-like elements.
     * Border color reacts to the `error` prop.
     */
    const baseInputClass = $derived([
        // Layout & spacing
        'w-full px-3.5 py-2.5 text-sm',
        // Shape
        'rounded-xl',
        // Background & text
        'bg-gray-100 text-gray-900 placeholder:text-gray-400',
        // Border
        'border',
        hasError ? 'border-red-400' : 'border-gray-200',
        // Outline / focus ring
        'outline-none transition-all duration-150',
        hasError
            ? 'focus:ring-2 focus:ring-red-400/20 focus:border-red-400'
            : 'focus:ring-2 focus:ring-[#996087]/20 focus:border-[#996087]',
        // Disabled state
        'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
    ].join(' '));
</script>

<!-- ─── Honeypot (visually hidden spam trap) ─────────────────────────────── -->
{#if type === 'honeypot'}
    <div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
        <input {id} {name} type="text" tabindex="-1" autocomplete="off" />
    </div>

<!-- ─── All visible field types ─────────────────────────────────────────── -->
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
                    <!-- Leading icon wrapper — absolutely positioned inside padding -->
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
            <!-- Hidden native file input — programmatically triggered -->
            <input
                {id}
                {name}
                type="file"
                {accept}
                {disabled}
                bind:this={inputRef}
                bind:files
                onchange={onFileChange ?? undefined}
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
            />

            <!-- Visible styled trigger button -->
            <button
                type="button"
                onclick={() => inputRef?.click()}
                {disabled}
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
                <span class="truncate {files && files.length > 0 ? 'text-gray-900' : 'text-gray-400'}">
                    {fileLabel}
                </span>
            </button>
        {/if}

        <!-- Hint text (shown when no error) -->
        {#if hint && !hasError}
            <p class="mt-1 text-xs text-gray-400">{hint}</p>
        {/if}

        <!-- Error message -->
        {#if hasError}
            <p class="mt-1.5 text-xs text-red-500">{error}</p>
        {/if}

    </div>
{/if}