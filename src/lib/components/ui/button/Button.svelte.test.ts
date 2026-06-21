/**
 * @file Button.svelte.test.ts
 * @description Comprehensive test suite for Button.svelte.
 *
 * Runner  : Vitest (project: client — jsdom)
 * Matches : src/**\/*.svelte.{test,spec}.{js,ts}
 * Covers  : all variants, sizes, states, slots, link mode, loading,
 *           disabled guard, security contracts, and accessibility.
 *
 * Run:
 *   bun run test:unit Button          # watch mode
 *   bun run test:unit --run Button    # single run
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import Button from '$lib/components/ui/Button/Button.svelte';

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => cleanup());

// ══════════════════════════════════════════════════════════════════════════════
// 1. DEFAULT RENDER
// ══════════════════════════════════════════════════════════════════════════════

describe('Default render', () => {
    it('renders a <button> element by default', () => {
        render(Button);
        expect(screen.getByRole('button').tagName).toBe('BUTTON');
    });

    it('has type="button" by default — no accidental form submit (B-07)', () => {
        render(Button);
        expect(screen.getByRole('button').getAttribute('type')).toBe('button');
    });

    it('is enabled by default', () => {
        render(Button);
        expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false);
    });

    it('forwards extra class to root element', () => {
        render(Button, { props: { class: 'test-custom-class' } });
        expect(screen.getByRole('button').classList.contains('test-custom-class')).toBe(true);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 2. VARIANTS
// ══════════════════════════════════════════════════════════════════════════════

describe('Variants', () => {
    it('primary — has brand bg color class', () => {
        render(Button, { props: { variant: 'primary' } });
        expect(screen.getByRole('button').className).toContain('bg-[#996087]');
    });

    it('secondary — has white bg and border', () => {
        render(Button, { props: { variant: 'secondary' } });
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('bg-white');
        expect(btn.className).toContain('border');
    });

    it('danger — has red bg class', () => {
        render(Button, { props: { variant: 'danger' } });
        expect(screen.getByRole('button').className).toContain('bg-red-600');
    });

    it('ghost — has transparent bg and no shadow', () => {
        render(Button, { props: { variant: 'ghost' } });
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('bg-transparent');
        expect(btn.className).toContain('shadow-none');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 3. SIZES
// ══════════════════════════════════════════════════════════════════════════════

describe('Sizes', () => {
    it('sm — has small padding class', () => {
        render(Button, { props: { size: 'sm' } });
        expect(screen.getByRole('button').className).toContain('px-2.5');
    });

    it('md — has medium padding class (default)', () => {
        render(Button, { props: { size: 'md' } });
        expect(screen.getByRole('button').className).toContain('px-3');
    });

    it('lg — has large padding class', () => {
        render(Button, { props: { size: 'lg' } });
        expect(screen.getByRole('button').className).toContain('px-4');
    });

    it('iconOnly sm — uses square padding', () => {
        render(Button, { props: { size: 'sm', iconOnly: true, ariaLabel: 'Action' } });
        expect(screen.getByRole('button').className).toContain('p-1.5');
    });

    it('iconOnly md — uses square padding', () => {
        render(Button, { props: { size: 'md', iconOnly: true, ariaLabel: 'Action' } });
        expect(screen.getByRole('button').className).toContain('p-2');
    });

    it('iconOnly lg — uses square padding', () => {
        render(Button, { props: { size: 'lg', iconOnly: true, ariaLabel: 'Action' } });
        expect(screen.getByRole('button').className).toContain('p-2.5');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. TYPE PROP
// ══════════════════════════════════════════════════════════════════════════════

describe('type prop', () => {
    it('type="submit" is forwarded to <button>', () => {
        render(Button, { props: { type: 'submit' } });
        expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
    });

    it('type="reset" is forwarded to <button>', () => {
        render(Button, { props: { type: 'reset' } });
        expect(screen.getByRole('button').getAttribute('type')).toBe('reset');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 5. FULL WIDTH
// ══════════════════════════════════════════════════════════════════════════════

describe('fullWidth', () => {
    it('adds w-full class when fullWidth=true', () => {
        render(Button, { props: { fullWidth: true } });
        expect(screen.getByRole('button').className).toContain('w-full');
    });

    it('does not have w-full when fullWidth=false', () => {
        render(Button, { props: { fullWidth: false } });
        expect(screen.getByRole('button').className).not.toContain('w-full');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 6. DISABLED STATE
// ══════════════════════════════════════════════════════════════════════════════

describe('Disabled state', () => {
    it('button is disabled when disabled=true', () => {
        render(Button, { props: { disabled: true } });
        expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    });

    it('onclick does NOT fire when disabled (B-08)', async () => {
        const onclick = vi.fn();
        render(Button, { props: { disabled: true, onclick } });
        await fireEvent.click(screen.getByRole('button'));
        expect(onclick).not.toHaveBeenCalled();
    });

    it('has opacity-50 class when disabled', () => {
        render(Button, { props: { disabled: true } });
        // disabled:opacity-50 is a Tailwind variant — check via className string
        expect(screen.getByRole('button').className).toContain('disabled:opacity-50');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 7. LOADING STATE (B-01, B-02, B-03)
// ══════════════════════════════════════════════════════════════════════════════

describe('Loading state', () => {
    it('loading=true disables the button (B-01)', () => {
        render(Button, { props: { loading: true } });
        expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    });

    it('onclick does NOT fire when loading (B-01 + B-08)', async () => {
        const onclick = vi.fn();
        render(Button, { props: { loading: true, onclick } });
        await fireEvent.click(screen.getByRole('button'));
        expect(onclick).not.toHaveBeenCalled();
    });

    it('renders spinner SVG when loading=true (B-02)', () => {
        render(Button, { props: { loading: true } });
        const svg = screen.getByRole('button').querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg!.classList.contains('animate-spin')).toBe(true);
    });

    it('sets aria-busy="true" when loading', () => {
        render(Button, { props: { loading: true } });
        expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true');
    });

    it('loading=false: aria-busy is not "true"', () => {
        render(Button, { props: { loading: false } });
        const busy = screen.getByRole('button').getAttribute('aria-busy');
        expect(busy === null || busy === 'false').toBe(true);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 8. ONCLICK HANDLER
// ══════════════════════════════════════════════════════════════════════════════

describe('onclick handler', () => {
    it('fires onclick when clicked and enabled', async () => {
        const onclick = vi.fn();
        render(Button, { props: { onclick } });
        await fireEvent.click(screen.getByRole('button'));
        expect(onclick).toHaveBeenCalledTimes(1);
    });

    it('fires onclick with the MouseEvent', async () => {
        const onclick = vi.fn();
        render(Button, { props: { onclick } });
        await fireEvent.click(screen.getByRole('button'));
        expect(onclick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('does not throw when onclick is undefined', async () => {
        render(Button);
        await expect(fireEvent.click(screen.getByRole('button'))).resolves.not.toThrow();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 9. LINK MODE — <a> rendering
// ══════════════════════════════════════════════════════════════════════════════

describe('Link mode (href)', () => {
    it('renders an <a> element when href is provided', () => {
        render(Button, { props: { href: '/dashboard' } });
        expect(screen.getByRole('button').tagName).toBe('A');
    });

    it('forwards href to <a>', () => {
        render(Button, { props: { href: '/dashboard' } });
        expect(screen.getByRole('button').getAttribute('href')).toBe('/dashboard');
    });

    it('adds role="button" to <a>', () => {
        render(Button, { props: { href: '/dashboard' } });
        expect(screen.getByRole('button').tagName).toBe('A');
    });

    it('target="_blank" adds rel="noopener noreferrer" (B-05)', () => {
        render(Button, { props: { href: '/external', target: '_blank' } });
        const rel = screen.getByRole('button').getAttribute('rel');
        expect(rel).toBe('noopener noreferrer');
    });

    it('target without _blank does NOT add rel', () => {
        render(Button, { props: { href: '/page', target: '_self' } });
        expect(screen.getByRole('button').getAttribute('rel')).toBeNull();
    });

    it('disabled <a> has aria-disabled="true" (B-04)', () => {
        render(Button, { props: { href: '/dashboard', disabled: true } });
        expect(screen.getByRole('button').getAttribute('aria-disabled')).toBe('true');
    });

    it('disabled <a> has tabindex="-1" (B-04)', () => {
        render(Button, { props: { href: '/dashboard', disabled: true } });
        expect(screen.getByRole('button').getAttribute('tabindex')).toBe('-1');
    });

    it('disabled <a> onclick guard prevents propagation (B-04)', async () => {
        const onclick = vi.fn();
        render(Button, { props: { href: '/dashboard', disabled: true, onclick } });
        await fireEvent.click(screen.getByRole('button'));
        expect(onclick).not.toHaveBeenCalled();
    });

    it('enabled <a> has tabindex="0"', () => {
        render(Button, { props: { href: '/dashboard' } });
        expect(screen.getByRole('button').getAttribute('tabindex')).toBe('0');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 10. ACCESSIBILITY
// ══════════════════════════════════════════════════════════════════════════════

describe('Accessibility', () => {
    it('ariaLabel is forwarded as aria-label', () => {
        render(Button, { props: { ariaLabel: 'Delete row', iconOnly: true } });
        expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Delete row');
    });

    it('ariaExpanded is forwarded as aria-expanded', () => {
        render(Button, { props: { ariaExpanded: true } });
        expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
    });

    it('ariaHaspopup is forwarded as aria-haspopup', () => {
        render(Button, { props: { ariaHaspopup: 'listbox' } });
        expect(screen.getByRole('button').getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('spinner SVG has aria-hidden="true"', () => {
        render(Button, { props: { loading: true } });
        const svg = screen.getByRole('button').querySelector('svg');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('has focus-visible ring class for keyboard focus', () => {
        render(Button);
        expect(screen.getByRole('button').className).toContain('focus-visible:ring-2');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 11. SECURITY CONTRACTS
// ══════════════════════════════════════════════════════════════════════════════

describe('Security contracts', () => {
    it('loading=true + disabled=false — still disabled (B-01)', async () => {
        const onclick = vi.fn();
        render(Button, { props: { loading: true, disabled: false, onclick } });
        await fireEvent.click(screen.getByRole('button'));
        expect(onclick).not.toHaveBeenCalled();
    });

    it('no {@html} — no dangerous innerHTML in rendered output', () => {
        const malicious = '<script>alert(1)</script>'
        render(Button, { props: { class: malicious } });
        expect(document.querySelector('script')).toBeNull();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 12. FULL-WIDTH FORM ACTION SCENARIO (Update Profile / Cancel pair)
// ══════════════════════════════════════════════════════════════════════════════

describe('Full-width form action scenario', () => {
    it('submit button — type=submit, fullWidth, primary', () => {
        render(Button, { props: { type: 'submit', fullWidth: true, variant: 'primary' } });
        const btn = screen.getByRole('button');
        expect(btn.getAttribute('type')).toBe('submit');
        expect(btn.className).toContain('w-full');
        expect(btn.className).toContain('bg-[#996087]');
    });

    it('cancel button — type=button, fullWidth, secondary', () => {
        render(Button, { props: { type: 'button', fullWidth: true, variant: 'secondary' } });
        const btn = screen.getByRole('button');
        expect(btn.getAttribute('type')).toBe('button');
        expect(btn.className).toContain('w-full');
        expect(btn.className).toContain('bg-white');
    });

    it('submit with loading disables and shows spinner', () => {
        render(Button, { props: { type: 'submit', loading: true, fullWidth: true } });
        const btn = screen.getByRole('button') as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
        expect(btn.querySelector('svg.animate-spin')).toBeTruthy();
    });

    it('submit disabled when isFormEmpty prop passed', () => {
        render(Button, { props: { type: 'submit', disabled: true } });
        expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13. BASE CLASSES ALWAYS PRESENT
// ══════════════════════════════════════════════════════════════════════════════

describe('Base classes always present', () => {
    it('has inline-flex class', () => {
        render(Button);
        expect(screen.getByRole('button').className).toContain('inline-flex');
    });

    it('has rounded-lg class', () => {
        render(Button);
        expect(screen.getByRole('button').className).toContain('rounded-lg');
    });

    it('has font-medium class', () => {
        render(Button);
        expect(screen.getByRole('button').className).toContain('font-medium');
    });

    it('has transition-colors class', () => {
        render(Button);
        expect(screen.getByRole('button').className).toContain('transition-colors');
    });

    it('has disabled:cursor-not-allowed class', () => {
        render(Button);
        expect(screen.getByRole('button').className).toContain('disabled:cursor-not-allowed');
    });
});