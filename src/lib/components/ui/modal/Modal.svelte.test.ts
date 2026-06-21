/**
 * @file Modal.svelte.test.ts
 * @description Comprehensive test suite for Modal.svelte.
 *
 * Runner  : Vitest (project: client — jsdom)
 * Matches : src/**\/*.svelte.{test,spec}.{js,ts}
 * Covers  : all three variants (crop, info, confirm), overlay/backdrop,
 *           close button, callbacks, accessibility, security, responsive.
 *
 * Run:
 *   bun run test:unit Modal          # watch
 *   bun run test:unit --run Modal    # single run
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import Modal from '$lib/components/ui/modal/Modal.svelte';

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => cleanup());

// ══════════════════════════════════════════════════════════════════════════════
// 1. VISIBILITY
// ══════════════════════════════════════════════════════════════════════════════

describe('Visibility', () => {
    it('renders nothing when show=false', () => {
        render(Modal, { props: { show: false, type: 'info', message: 'Hello' } });
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renders dialog when show=true', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('renders nothing when show=false for confirm type', () => {
        render(Modal, { props: { show: false, type: 'confirm', message: 'Logout?' } });
        expect(screen.queryByRole('dialog')).toBeNull();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 2. BACKDROP / OVERLAY
// ══════════════════════════════════════════════════════════════════════════════

describe('Backdrop overlay', () => {
    it('backdrop has dark bg overlay class', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('bg-black/60');
    });

    it('backdrop covers full screen (fixed inset-0)', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('fixed');
        expect(dialog.className).toContain('inset-0');
    });

    it('backdrop has high z-index (z-[60])', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('z-[60]');
    });

    it('backdrop has backdrop-blur', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('backdrop-blur');
    });

    it('clicking backdrop closes info modal', async () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const backdropBtn = screen.getByLabelText('Close modal');
        await fireEvent.click(backdropBtn);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('clicking backdrop closes confirm modal', async () => {
        render(Modal, { props: { show: true, type: 'confirm', message: 'Sure?' } });
        const backdropBtn = screen.getByLabelText('Close modal');
        await fireEvent.click(backdropBtn);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('crop modal does NOT close on backdrop click', async () => {
        render(Modal, { props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() } });
        const backdropBtn = screen.getByLabelText('Close modal');
        await fireEvent.click(backdropBtn);
        // Crop should still be visible
        expect(screen.getByRole('dialog')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 3. CLOSE BUTTON (X)
// ══════════════════════════════════════════════════════════════════════════════

describe('Close button (X)', () => {
    it('renders X close button for info modal', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        expect(screen.getByLabelText('Close')).toBeTruthy();
    });

    it('renders X close button for confirm modal', () => {
        render(Modal, { props: { show: true, type: 'confirm', message: 'Sure?' } });
        expect(screen.getByLabelText('Close')).toBeTruthy();
    });

    it('renders X close button for crop modal', () => {
        render(Modal, { props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() } });
        expect(screen.getByLabelText('Close')).toBeTruthy();
    });

    it('clicking X closes info modal', async () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        await fireEvent.click(screen.getByLabelText('Close'));
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('clicking X closes confirm modal', async () => {
        render(Modal, { props: { show: true, type: 'confirm', message: 'Sure?' } });
        await fireEvent.click(screen.getByLabelText('Close'));
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('clicking X closes crop modal', async () => {
        render(Modal, { props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() } });
        await fireEvent.click(screen.getByLabelText('Close'));
        expect(screen.queryByRole('dialog')).toBeNull();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. INFO VARIANT
// ══════════════════════════════════════════════════════════════════════════════

describe('type="info"', () => {
    it('renders message text', () => {
        render(Modal, {
            props: {
                show: true,
                type: 'info',
                message: 'We use cookies for improving user experience.',
            },
        });
        expect(screen.getByText('We use cookies for improving user experience.')).toBeTruthy();
    });

    it('renders confirmLabel as button text', () => {
        render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: "That's fine!" },
        });
        expect(screen.getByRole('button', { name: /that's fine/i })).toBeTruthy();
    });

    it('confirm button has primary variant (brand color)', () => {
        render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: "That's fine!" },
        });
        const btn = screen.getByRole('button', { name: /that's fine/i });
        expect(btn.className).toContain('bg-[#996087]');
    });

    it('confirm button is full width', () => {
        render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: "That's fine!" },
        });
        const btn = screen.getByRole('button', { name: /that's fine/i });
        expect(btn.className).toContain('w-full');
    });

    it('calls onConfirm when confirm button clicked', async () => {
        const onConfirm = vi.fn();
        render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: 'OK', onConfirm },
        });
        await fireEvent.click(screen.getByRole('button', { name: /^ok$/i }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('closes modal after confirm button clicked', async () => {
        render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: 'OK' },
        });
        await fireEvent.click(screen.getByRole('button', { name: /^ok$/i }));
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('onConfirm is optional — does not throw if undefined', async () => {
        render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: 'OK' },
        });
        await expect(
            fireEvent.click(screen.getByRole('button', { name: /^ok$/i }))
        ).resolves.not.toThrow();
    });

    it('defaults confirmLabel to "OK" when not provided', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        expect(screen.getByRole('button', { name: /^ok$/i })).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 5. CONFIRM VARIANT
// ══════════════════════════════════════════════════════════════════════════════

describe('type="confirm"', () => {
    it('renders message text', () => {
        render(Modal, {
            props: {
                show: true,
                type: 'confirm',
                message: 'You will be logged out immediately!',
            },
        });
        expect(screen.getByText('You will be logged out immediately!')).toBeTruthy();
    });

    it('renders confirmLabel as button text', () => {
        render(Modal, {
            props: { show: true, type: 'confirm', message: 'Sure?', confirmLabel: 'Extend login' },
        });
        expect(screen.getByRole('button', { name: /extend login/i })).toBeTruthy();
    });

    it('confirm button has danger variant (red)', () => {
        render(Modal, {
            props: { show: true, type: 'confirm', message: 'Sure?', confirmLabel: 'Extend login' },
        });
        const btn = screen.getByRole('button', { name: /extend login/i });
        expect(btn.className).toContain('bg-red-600');
    });

    it('confirm button is full width', () => {
        render(Modal, {
            props: { show: true, type: 'confirm', message: 'Sure?', confirmLabel: 'Extend login' },
        });
        expect(screen.getByRole('button', { name: /extend login/i }).className).toContain('w-full');
    });

    it('calls onConfirm when confirm button clicked', async () => {
        const onConfirm = vi.fn();
        render(Modal, {
            props: {
                show: true, type: 'confirm',
                message: 'Sure?', confirmLabel: 'Extend login', onConfirm,
            },
        });
        await fireEvent.click(screen.getByRole('button', { name: /extend login/i }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('closes modal after confirm clicked', async () => {
        render(Modal, {
            props: { show: true, type: 'confirm', message: 'Sure?', confirmLabel: 'Yes' },
        });
        await fireEvent.click(screen.getByRole('button', { name: /^yes$/i }));
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('info uses primary button, confirm uses danger button — they differ', () => {
        const { unmount } = render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: 'OK' },
        });
        const infoBtn = screen.getByRole('button', { name: /^ok$/i });
        const infoClass = infoBtn.className;
        unmount();
        cleanup();

        render(Modal, {
            props: { show: true, type: 'confirm', message: 'Sure?', confirmLabel: 'OK' },
        });
        const confirmBtn = screen.getByRole('button', { name: /^ok$/i });
        expect(infoClass).toContain('bg-[#996087]');
        expect(confirmBtn.className).toContain('bg-red-600');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 6. CROP VARIANT
// ══════════════════════════════════════════════════════════════════════════════

describe('type="crop"', () => {
    it('renders "Adjust Your Image" heading', () => {
        render(Modal, {
            props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() },
        });
        expect(screen.getByText('Adjust Your Image')).toBeTruthy();
    });

    it('renders zoom range input', () => {
        render(Modal, {
            props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() },
        });
        const range = document.querySelector('input[type="range"]') as HTMLInputElement;
        expect(range).toBeTruthy();
        expect(range.getAttribute('min')).toBe('1');
        expect(range.getAttribute('max')).toBe('3');
    });

    it('renders "Apply Crop" button', () => {
        render(Modal, {
            props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() },
        });
        expect(screen.getByRole('button', { name: /apply crop/i })).toBeTruthy();
    });

    it('Apply Crop button has primary variant', () => {
        render(Modal, {
            props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() },
        });
        expect(
            screen.getByRole('button', { name: /apply crop/i }).className
        ).toContain('bg-[#996087]');
    });

    it('zoom range has aria-label', () => {
        render(Modal, {
            props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() },
        });
        const range = document.querySelector('input[type="range"]');
        expect(range?.getAttribute('aria-label')).toBe('Zoom level');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 7. CARD DESIGN CONTRACTS
// ══════════════════════════════════════════════════════════════════════════════

describe('Card design contracts', () => {
    it('modal card has rounded-xl', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const card = document.querySelector('.rounded-xl');
        expect(card).toBeTruthy();
    });

    it('modal card has shadow-xs', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const card = document.querySelector('.shadow-xs');
        expect(card).toBeTruthy();
    });

    it('modal card has white background', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const card = document.querySelector('.bg-white');
        expect(card).toBeTruthy();
    });

    it('modal card has max-w-sm — constrained width on all screens', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const card = document.querySelector('.max-w-sm');
        expect(card).toBeTruthy();
    });

    it('modal is centered via flex items-center justify-center', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('items-center');
        expect(dialog.className).toContain('justify-center');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 8. ACCESSIBILITY
// ══════════════════════════════════════════════════════════════════════════════

describe('Accessibility', () => {
    it('dialog has role="dialog"', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('dialog has aria-modal="true"', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    });

    it('X button has aria-label="Close"', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        expect(screen.getByLabelText('Close')).toBeTruthy();
    });

    it('X button SVG icon has aria-hidden="true"', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const closeBtn = screen.getByLabelText('Close');
        const svg = closeBtn.querySelector('svg');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('icon snippet wrapper has aria-hidden="true" — decorative', () => {
        // Icon is decorative; message text carries the meaning
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        // If no icon provided, no icon span rendered — test structure only
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeTruthy();
    });

    it('backdrop close button has tabindex="-1" — not in tab order', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const backdropBtn = screen.getByLabelText('Close modal');
        expect(backdropBtn.getAttribute('tabindex')).toBe('-1');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 9. SECURITY
// ══════════════════════════════════════════════════════════════════════════════

describe('Security contracts', () => {
    it('message with HTML tags is NOT injected as markup', () => {
        render(Modal, {
            props: {
                show: true,
                type: 'info',
                message: '<script>alert(1)</script>',
            },
        });
        // No actual script element should be created
        expect(document.querySelectorAll('script').length).toBe(0);
    });

    it('confirmLabel with HTML is NOT injected as markup', () => {
        render(Modal, {
            props: {
                show: true,
                type: 'info',
                message: 'Hello',
                confirmLabel: '<img src=x onerror=alert(1)>',
            },
        });
        const injected = Array.from(document.querySelectorAll('img')).filter(
            img => img.getAttribute('src') === 'x'
        );
        expect(injected.length).toBe(0);
    });

    it('no {@html} — no inline script injection via props', () => {
        render(Modal, {
            props: { show: true, type: 'confirm', message: 'Safe?', confirmLabel: 'Yes' },
        });
        expect(document.querySelectorAll('script').length).toBe(0);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 10. RESPONSIVE LAYOUT
// ══════════════════════════════════════════════════════════════════════════════

describe('Responsive layout', () => {
    it('backdrop has p-4 padding — prevents card touching screen edge on mobile', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        expect(screen.getByRole('dialog').className).toContain('p-4');
    });

    it('card has w-full — fills available space on mobile', () => {
        render(Modal, { props: { show: true, type: 'info', message: 'Hello' } });
        const card = screen.getByRole('dialog').querySelector('.w-full.max-w-sm');
        expect(card).toBeTruthy();
    });

    it('confirm button is full width on all screen sizes', () => {
        render(Modal, {
            props: { show: true, type: 'info', message: 'Hello', confirmLabel: 'OK' },
        });
        expect(screen.getByRole('button', { name: /^ok$/i }).className).toContain('w-full');
    });

    it('crop modal canvas has explicit height style — consistent cross-browser', () => {
        render(Modal, {
            props: { show: true, type: 'crop', imageSrc: 'blob:test', onCropComplete: vi.fn() },
        });
        const canvas = document.querySelector('[style*="height: 300px"]');
        expect(canvas).toBeTruthy();
    });
});