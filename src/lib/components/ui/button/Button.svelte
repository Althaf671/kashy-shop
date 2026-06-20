<script lang="ts">
    /**
     * @file Button.svelte
     * @description The "Super Button" — a single, universal, reusable button
     * component built with raw HTML, Tailwind CSS, and Svelte 5 runes.
     * Replaces every Flowbite <Button> usage across the app (primary actions,
     * secondary/outline actions, dropdown triggers, destructive actions, form
     * submit/cancel pairs with loading state, icon-only buttons, and link-style
     * buttons). Zero external UI dependencies — matches the philosophy of
     * FormField.svelte.
     *
     * Design tokens (derived from the existing UI, consolidated to ONE
     * canonical value per state so the system stays consistent):
     *   - radius        : rounded-lg
     *   - shadow        : shadow-xs (none for `ghost`)
     *   - primary       : bg-[#996087] · text-[#f4f3ee] · hover:bg-[#824C71]
     *   - secondary     : bg-white · border-[#e5e7eb] · text-[#636363] · hover:bg-gray-50
     *   - disabled      : opacity-50 + cursor-not-allowed + pointer-events-none
     *
     * `danger` and `ghost` are additive extensions (not in the original
     * screenshots) built from the same shape/spacing language, for destructive
     * actions and low-emphasis/icon-only actions respectively. Safe to ignore
     * if not needed.
     *
     * SECURITY / MEMORY-LEAK NOTES (see bottom of file for full explanation):
     *  - No `{@html}` anywhere → no markup-injection surface at all.
     *  - `type="button"` by default → no accidental form submits.
     *  - `target="_blank"` auto-gets `rel="noopener noreferrer"`.
     *  - `loading` forcibly disables the button → no duplicate click / double
     *    network request (e.g. spamming "Export CSV").
     *  - Disabled `<a>` is truly inert (aria-disabled + pointer-events-none +
     *    click handler bails out), not just visually disabled.
     *  - No addEventListener / setTimeout / module-level state → nothing to
     *    leak, nothing to clean up in onDestroy.
     *
     * @example — primary with leading icon (Export CSV)
     * <Button variant="primary" onclick={exportCsv}>
     *   {#snippet icon()}<DownloadSolid class="h-4.5 w-4.5" />{/snippet}
     *   Export CSV
     * </Button>
     *
     * @example — secondary dropdown trigger (All Time ▾)
     * <Button
     *   variant="secondary"
     *   ariaHaspopup="listbox"
     *   ariaExpanded={open}
     *   onclick={() => (open = !open)}
     * >
     *   {#snippet icon()}<CalendarMonthOutline class="h-4 w-4 text-[#7d7d7d]" />{/snippet}
     *   {selectedRange}
     *   {#snippet trailingIcon()}<ChevronDownOutline class="h-4 w-4 text-[#7d7d7d]" />{/snippet}
     * </Button>
     *
     * @example — full-width submit/cancel pair with loading state
     * <div class="flex gap-3">
     *   <Button
     *     type="submit"
     *     size="lg"
     *     fullWidth
     *     loading={updating}
     *     loadingText="Updating..."
     *     disabled={isFormEmpty}
     *   >
     *     Update Profile
     *   </Button>
     *   <Button variant="secondary" size="lg" fullWidth disabled={updating} onclick={() => (open = false)}>
     *     Cancel
     *   </Button>
     * </div>
     *
     * @example — icon-only ghost button (e.g. row action in a table)
     * <Button variant="ghost" iconOnly ariaLabel="Delete row" onclick={handleDelete}>
     *   {#snippet icon()}<TrashBinOutline class="h-4 w-4" />{/snippet}
     * </Button>
     *
     * @example — link-style button (renders a real <a>, still gets all the safety rails)
     * <Button href="/billing" variant="secondary" target="_blank">
     *   Open billing
     * </Button>
     */

    import type { Snippet } from 'svelte';

    type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
    type ButtonSize = 'sm' | 'md' | 'lg';
    type ButtonType = 'button' | 'submit' | 'reset';

    // ─── Props ────────────────────────────────────────────────────────────────

    let {
        /**
         * Visual style of the button.
         * - `'primary'`   — main call-to-action (Export CSV, Update Profile)
         * - `'secondary'` — outline/neutral action (Cancel, dropdown triggers)
         * - `'danger'`    — destructive action (Delete, Remove)
         * - `'ghost'`     — lowest emphasis, no border/shadow (table row actions)
         * @default 'primary'
         */
        variant = 'primary' as ButtonVariant,

        /**
         * Controls padding + font-size. `lg` is the right choice for full-width
         * form actions (Update Profile / Cancel), `md` matches compact toolbar
         * buttons (Export CSV / "All Time"), `sm` is for dense UI (table rows).
         * @default 'md'
         */
        size = 'md' as ButtonSize,

        /** Native button `type`. Irrelevant when `href` is set. @default 'button' */
        type = 'button' as ButtonType,

        /**
         * If provided, the component renders a real `<a>` instead of a
         * `<button>`, with all the same visual states. Use for navigation,
         * never for actions that mutate data (use onclick for that).
         */
        href = undefined as string | undefined,

        /** Forwarded to `<a>` when `href` is set, e.g. `'_blank'`. */
        target = undefined as string | undefined,

        /** Stretches the button to fill its container's width. @default false */
        fullWidth = false,

        /**
         * Renders only the icon (no visible text). Requires `ariaLabel` to
         * stay accessible. Adjusts padding to be square. @default false
         */
        iconOnly = false,

        /** Disables interaction and dims the button. @default false */
        disabled = false,

        /**
         * Shows a spinner and forces the disabled state — use for any async
         * action (export, save, submit) so a slow request can't be fired
         * twice by an impatient double-click. @default false
         */
        loading = false,

        /** Text shown next to the spinner while `loading` is true. If omitted, the normal children are kept. */
        loadingText = undefined as string | undefined,

        /** Required when `iconOnly` is true (and recommended whenever the visible label alone isn't descriptive enough). */
        ariaLabel = undefined as string | undefined,

        /** Set when this button toggles a dropdown/panel, e.g. `open`. */
        ariaExpanded = undefined as boolean | undefined,

        /** Set when this button opens a popup-like widget, e.g. `'listbox'` | `'menu'` | `'dialog'` | `true`. */
        ariaHaspopup = undefined as boolean | 'listbox' | 'menu' | 'dialog' | 'true' | 'false' | undefined,

        /**
         * Click handler. Fires for both `<button>` and `<a>` modes. Never
         * fires while `disabled` or `loading` is true — this is enforced
         * even for `<a>`, where the native `disabled` attribute doesn't exist.
         */
        onclick = undefined as ((e: MouseEvent) => void) | null | undefined,

        /** Leading icon — render a single SVG/icon component inside. */
        icon = undefined as Snippet | undefined,

        /** Trailing icon — typically a chevron for dropdown triggers. */
        trailingIcon = undefined as Snippet | undefined,

        /** Button label / content (plain text or markup-free Svelte content). */
        children = undefined as Snippet | undefined,

        /** Extra Tailwind classes forwarded to the root element. */
        class: customClass = '',

        ...rest
    }: {
        variant?: ButtonVariant;
        size?: ButtonSize;
        type?: ButtonType;
        href?: string;
        target?: string;
        fullWidth?: boolean;
        iconOnly?: boolean;
        disabled?: boolean;
        loading?: boolean;
        loadingText?: string;
        ariaLabel?: string;
        ariaExpanded?: boolean;
        ariaHaspopup?: boolean | 'listbox' | 'menu' | 'dialog' | 'true' | 'false';
        onclick?: ((e: MouseEvent) => void) | null;
        icon?: Snippet;
        trailingIcon?: Snippet;
        children?: Snippet;
        class?: string;
        [key: string]: unknown;
    } = $props();

    // ─── Derived state ────────────────────────────────────────────────────────

    /** Single source of truth: loading always implies disabled. */
    const isDisabled = $derived(disabled || loading);

    /** rel hardening — only ever added, never something the caller can weaken. */
    const relValue = $derived(target === '_blank' ? 'noopener noreferrer' : undefined);

    // ─── Class builders ───────────────────────────────────────────────────────

    const variantClasses: Record<ButtonVariant, string> = {
        primary: 'bg-[#996087] text-[#f4f3ee] hover:bg-[#824C71] focus-visible:ring-[#996087]/30 shadow-xs',
        secondary: 'bg-white text-[#636363] border border-[#e5e7eb] hover:bg-gray-50 focus-visible:ring-gray-300 shadow-xs',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400/40 shadow-xs',
        ghost: 'bg-transparent text-[#636363] hover:bg-gray-100 focus-visible:ring-gray-300 shadow-none',
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'text-xs gap-1.5 px-2.5 py-1.5',
        md: 'text-sm gap-1.5 px-3 py-2',
        lg: 'text-sm gap-2 px-4 py-2.5',
    };

    const iconOnlySizeClasses: Record<ButtonSize, string> = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5',
    };

    const baseClasses =
        'inline-flex items-center justify-center font-medium whitespace-nowrap rounded-lg ' +
        'transition-colors duration-150 outline-none select-none ' +
        'focus-visible:ring-2 focus-visible:ring-offset-1 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none';

    const rootClass = $derived(
        [
            baseClasses,
            variantClasses[variant],
            iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
            fullWidth ? 'w-full' : '',
            // <a> has no native `disabled` attribute/pseudo-class, so the
            // disabled look + inertness has to be applied manually here too.
            href && isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
            customClass,
        ]
            .filter(Boolean)
            .join(' ')
    );

    // ─── Guarded click handler ───────────────────────────────────────────────
    // Single chokepoint for both <button> and <a>. For <a>, this is the part
    // that actually stops navigation when disabled — CSS alone can't, since
    // a keyboard-activated link ignores `pointer-events: none`.
    function handleClick(e: MouseEvent) {
        if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onclick?.(e);
    }
</script>

{#snippet content()}
    {#if loading}
        <svg class="h-4 w-4 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
        </svg>
    {:else if icon}
        <span class="inline-flex shrink-0 items-center">{@render icon()}</span>
    {/if}

    {#if !iconOnly}
        <span class="truncate">
            {#if loading && loadingText}
                {loadingText}
            {:else if children}
                {@render children()}
            {/if}
        </span>
    {/if}

    {#if !loading && !iconOnly && trailingIcon}
        <span class="inline-flex shrink-0 items-center">{@render trailingIcon()}</span>
    {/if}
{/snippet}

<!-- Render as a real <a> only when navigation is intended. -->
{#if href}
    <a
        {...rest}
        {href}
        {target}
        rel={relValue}
        role="button"
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHaspopup}
        tabindex={isDisabled ? -1 : 0}
        class={rootClass}
        onclick={handleClick}
    >
        {@render content()}
    </a>
{:else}
    <button
        {...rest}
        {type}
        disabled={isDisabled}
        aria-busy={loading}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHaspopup}
        class={rootClass}
        onclick={handleClick}
    >
        {@render content()}
    </button>
{/if}