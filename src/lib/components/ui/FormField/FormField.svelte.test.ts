/**
 * @file FormField.svelte.test.ts
 * @description Comprehensive test suite for FormField.svelte.
 *
 * Runner  : Vitest (project: client — browser/jsdom via Playwright)
 * Matches : src/**\/*.svelte.{test,spec}.{js,ts}  (vite.config.ts → client project)
 * Covers  : all prop combinations, visual states, behavior contracts,
 *           accessibility, and file/crop integration from the profile
 *           patch drawer.
 *
 * Run:
 *   bun run test:unit FormField          # watch mode
 *   bun run test:unit --run FormField    # single run
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import FormField from '$lib/components/ui/formField/FormField.svelte';

/**
 * Shared minimal required props for every render call.
 * Spread and override per test.
 */
const base = {
    label: 'Fullname',
    id: 'name',
    name: 'name',
} as const;

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => cleanup());

// ══════════════════════════════════════════════════════════════════════════════
// 1. LABEL RENDERING
// ══════════════════════════════════════════════════════════════════════════════

describe('Label', () => {
    it('renders the label text', () => {
        render(FormField, { props: { ...base, label: 'Fullname' } });
        expect(screen.getByText('Fullname')).toBeTruthy();
    });

    it('associates <label> with input via matching id', () => {
        render(FormField, { props: { ...base, type: 'text' } });
        const label = screen.getByText('Fullname');
        expect(label.getAttribute('for')).toBe('name');
        expect(screen.getByRole('textbox').getAttribute('id')).toBe('name');
    });

    it('turns label red when error is present', () => {
        render(FormField, { props: { ...base, error: 'Required' } });
        expect(screen.getByText('Fullname').classList.contains('text-red-500')).toBe(true);
    });

    it('keeps label dark gray when no error', () => {
        render(FormField, { props: { ...base } });
        expect(screen.getByText('Fullname').classList.contains('text-gray-900')).toBe(true);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 2. TEXT INPUT — name, email, phone, quote
// ══════════════════════════════════════════════════════════════════════════════

describe('type="text"', () => {
    it('renders an <input type="text">', () => {
        render(FormField, { props: { ...base, type: 'text' } });
        expect(screen.getByRole('textbox').getAttribute('type')).toBe('text');
    });

    it('forwards placeholder', () => {
        render(FormField, { props: { ...base, placeholder: 'Kashley Vanrogoue' } });
        expect(screen.getByPlaceholderText('Kashley Vanrogoue')).toBeTruthy();
    });

    it('forwards name attribute', () => {
        render(FormField, { props: { ...base, name: 'fullname' } });
        expect(screen.getByRole('textbox').getAttribute('name')).toBe('fullname');
    });

    it('is enabled by default', () => {
        render(FormField, { props: { ...base } });
        expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(false);
    });

    it('becomes disabled when disabled=true', () => {
        render(FormField, { props: { ...base, disabled: true } });
        expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
    });

    it('renders without icon — no pl-10 class', () => {
        render(FormField, { props: { ...base } });
        expect(screen.getByRole('textbox').classList.contains('pl-10')).toBe(false);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 3. EMAIL INPUT
// ══════════════════════════════════════════════════════════════════════════════

describe('type="email"', () => {
    it('renders an <input type="email">', () => {
        render(FormField, {
            props: { ...base, label: 'Email', id: 'email', name: 'email', type: 'email' },
        });
        expect(screen.getByRole('textbox').getAttribute('type')).toBe('email');
    });

    it('forwards email placeholder', () => {
        render(FormField, {
            props: {
                ...base, label: 'Email', id: 'email', name: 'email',
                type: 'email', placeholder: 'kashgallery@gmail.com',
            },
        });
        expect(screen.getByPlaceholderText('kashgallery@gmail.com')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. TEL INPUT — phone field
// ══════════════════════════════════════════════════════════════════════════════

describe('type="tel"', () => {
    it('renders an <input type="tel">', () => {
        render(FormField, {
            props: { ...base, label: 'Phone', id: 'phone', name: 'phone', type: 'tel' },
        });
        const input = document.getElementById('phone') as HTMLInputElement;
        expect(input.getAttribute('type')).toBe('tel');
    });

    it('forwards tel placeholder', () => {
        render(FormField, {
            props: {
                ...base, label: 'Phone', id: 'phone', name: 'phone',
                type: 'tel', placeholder: '+628123456789',
            },
        });
        expect(screen.getByPlaceholderText('+628123456789')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 5. DATE INPUT — birthday field
// ══════════════════════════════════════════════════════════════════════════════

describe('type="date"', () => {
    it('renders an <input type="date">', () => {
        render(FormField, {
            props: { ...base, label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt', type: 'date' },
        });
        const input = document.getElementById('birthdayAt') as HTMLInputElement;
        expect(input.getAttribute('type')).toBe('date');
    });

    it('is disabled when disabled=true', () => {
        render(FormField, {
            props: {
                ...base, label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt',
                type: 'date', disabled: true,
            },
        });
        expect((document.getElementById('birthdayAt') as HTMLInputElement).disabled).toBe(true);
    });

    it('shows red border class when error is set', () => {
        render(FormField, {
            props: {
                ...base, label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt',
                type: 'date', error: 'Invalid date',
            },
        });
        expect(document.getElementById('birthdayAt')!.classList.contains('border-red-400')).toBe(true);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 6. TEXTAREA — biography field
// ══════════════════════════════════════════════════════════════════════════════

describe('type="textarea"', () => {
    it('renders a <textarea>', () => {
        render(FormField, {
            props: { ...base, label: 'Biography', id: 'biography', name: 'biography', type: 'textarea' },
        });
        expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });

    it('defaults to rows=3', () => {
        render(FormField, {
            props: { ...base, label: 'Biography', id: 'biography', name: 'biography', type: 'textarea' },
        });
        expect(screen.getByRole('textbox').getAttribute('rows')).toBe('3');
    });

    it('accepts custom rows prop', () => {
        render(FormField, {
            props: {
                ...base, label: 'Biography', id: 'biography', name: 'biography',
                type: 'textarea', rows: 5,
            },
        });
        expect(screen.getByRole('textbox').getAttribute('rows')).toBe('5');
    });

    it('forwards placeholder', () => {
        render(FormField, {
            props: {
                ...base, label: 'Biography', id: 'biography', name: 'biography',
                type: 'textarea', placeholder: 'Tell us about yourself...',
            },
        });
        expect(screen.getByPlaceholderText('Tell us about yourself...')).toBeTruthy();
    });

    it('has resize-none class', () => {
        render(FormField, {
            props: { ...base, label: 'Biography', id: 'biography', name: 'biography', type: 'textarea' },
        });
        expect(screen.getByRole('textbox').classList.contains('resize-none')).toBe(true);
    });

    it('is disabled when disabled=true', () => {
        render(FormField, {
            props: {
                ...base, label: 'Biography', id: 'biography', name: 'biography',
                type: 'textarea', disabled: true,
            },
        });
        expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 7. FILE INPUT — avatar + banner
// ══════════════════════════════════════════════════════════════════════════════

describe('type="file"', () => {
    it('renders a visible trigger button', () => {
        render(FormField, {
            props: { ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        expect(screen.getByRole('button', { name: /choose avatar picture/i })).toBeTruthy();
    });

    it('hides the native file input from accessibility tree', () => {
        render(FormField, {
            props: { ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement;
        expect(nativeInput.getAttribute('aria-hidden')).toBe('true');
        expect(nativeInput.getAttribute('tabindex')).toBe('-1');
        expect(nativeInput.classList.contains('sr-only')).toBe(true);
    });

    it('shows fallback placeholder text when no file selected', () => {
        render(FormField, {
            props: { ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        // Component renders "Choose avatar picture" — capital C from label transform
        expect(screen.getByText('Choose avatar picture')).toBeTruthy();
    });

    it('forwards accept attribute to native input', () => {
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', accept: '.jpg,.png,.jpeg',
            },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement;
        expect(nativeInput.getAttribute('accept')).toBe('.jpg,.png,.jpeg');
    });

    it('calls onFileChange when a file is selected', async () => {
        const onFileChange = vi.fn();
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', onFileChange,
            },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement;
        await fireEvent.change(nativeInput);
        expect(onFileChange).toHaveBeenCalledTimes(1);
    });

    it('trigger button is disabled when disabled=true', () => {
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', disabled: true,
            },
        });
        expect((screen.getByRole('button', { name: /choose avatar picture/i }) as HTMLButtonElement).disabled).toBe(true);
    });

    it('shows red border on trigger button when error is set', () => {
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', error: 'File is required',
            },
        });
        const btn = screen.getByRole('button', { name: /choose avatar picture/i });
        expect(btn.classList.contains('border-red-400')).toBe(true);
    });

    it('displays selected filename when files prop has a file', async () => {
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file'
            },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement
        const file = new File(['binary'], 'my-avatar.jpg', { type: 'image/jpeg' })
        await fireEvent.change(nativeInput, { target: { files: [file] } })
        expect(screen.getByText('my-avatar.jpg')).toBeTruthy();
    });

    it('displays banner filename for profile banner field', async () => {
        render(FormField, {
            props: {
                label: 'Profile Banner', id: 'profileBanner', name: 'profileBanner',
                type: 'file'
            },
        });
        const nativeInput = document.getElementById('profileBanner') as HTMLInputElement
        const file = new File(['binary'], 'my-banner.png', { type: 'image/png' })
        await fireEvent.change(nativeInput, { target: { files: [file] } })
        expect(screen.getByText('my-banner.png')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 8. HONEYPOT
// ══════════════════════════════════════════════════════════════════════════════

describe('type="honeypot"', () => {
    it('renders an off-screen input that is not visible', () => {
        render(FormField, {
            props: { ...base, label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        const wrapper = document.querySelector('[aria-hidden="true"]') as HTMLElement;
        expect(wrapper).toBeTruthy();
        expect(wrapper.style.left).toBe('-9999px');
    });

    it('has tabindex=-1 on the honeypot input', () => {
        render(FormField, {
            props: { ...base, label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        const input = document.getElementById('website') as HTMLInputElement;
        expect(input.getAttribute('tabindex')).toBe('-1');
    });

    it('has autocomplete=off on the honeypot input', () => {
        render(FormField, {
            props: { ...base, label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        const input = document.getElementById('website') as HTMLInputElement;
        expect(input.getAttribute('autocomplete')).toBe('off');
    });

    it('does not render a visible label for honeypot', () => {
        render(FormField, {
            props: { ...base, label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        expect(screen.queryByText('Website')).toBeNull();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 9. ERROR STATE
// ══════════════════════════════════════════════════════════════════════════════

describe('Error state', () => {
    it('renders error message below input', () => {
        render(FormField, { props: { ...base, error: 'Name is required' } });
        expect(screen.getByText('Name is required')).toBeTruthy();
    });

    it('error message has red color class', () => {
        render(FormField, { props: { ...base, error: 'Name is required' } });
        expect(screen.getByText('Name is required').classList.contains('text-red-500')).toBe(true);
    });

    it('input has red border class when error is set', () => {
        render(FormField, { props: { ...base, error: 'Name is required' } });
        expect(screen.getByRole('textbox').classList.contains('border-red-400')).toBe(true);
    });

    it('does not render error message when error is null', () => {
        render(FormField, { props: { ...base, error: null } });
        expect(document.querySelector('p.text-red-500')).toBeNull();
    });

    it('does not render error message when error is empty string', () => {
        render(FormField, { props: { ...base, error: '' } });
        expect(document.querySelector('p.text-red-500')).toBeNull();
    });

    it('input uses brand focus ring when no error', () => {
        render(FormField, { props: { ...base } });
        // classList.contains does not work for Tailwind arbitrary-value classes with brackets;
        // check the raw className string instead
        expect(screen.getByRole('textbox').className).toContain('focus:ring-[#996087]/90');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 10. HINT TEXT
// ══════════════════════════════════════════════════════════════════════════════

describe('Hint text', () => {
    it('renders hint when provided and no error', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', hint: 'PNG, JPG or JPEG.',
            },
        });
        expect(screen.getByText('PNG, JPG or JPEG.')).toBeTruthy();
    });

    it('hint is gray', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', hint: 'PNG, JPG or JPEG.',
            },
        });
        expect(screen.getByText('PNG, JPG or JPEG.').classList.contains('text-gray-400')).toBe(true);
    });

    it('hides hint when error is present (B-03)', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', hint: 'PNG, JPG or JPEG.', error: 'File too large',
            },
        });
        expect(screen.queryByText('PNG, JPG or JPEG.')).toBeNull();
        expect(screen.getByText('File too large')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 11. DISABLED STATE (B-05)
// ══════════════════════════════════════════════════════════════════════════════

describe('Disabled state (B-05)', () => {
    it('text input is disabled', () => {
        render(FormField, { props: { ...base, disabled: true } });
        expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
    });

    it('textarea is disabled', () => {
        render(FormField, {
            props: { ...base, label: 'Biography', id: 'biography', name: 'biography', type: 'textarea', disabled: true },
        });
        expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true);
    });

    it('date input is disabled', () => {
        render(FormField, {
            props: { ...base, label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt', type: 'date', disabled: true },
        });
        expect((document.getElementById('birthdayAt') as HTMLInputElement).disabled).toBe(true);
    });

    it('file trigger button is disabled', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', disabled: true,
            },
        });
        expect((screen.getByRole('button', { name: /choose/i }) as HTMLButtonElement).disabled).toBe(true);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 12. CUSTOM CLASS FORWARDING
// ══════════════════════════════════════════════════════════════════════════════

describe('class prop', () => {
    it('forwards custom class to the wrapper div', () => {
        render(FormField, { props: { ...base, class: 'mt-4 test-wrapper' } });
        expect(document.querySelector('.test-wrapper')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13. FULL DRAWER SCENARIO — all fields from patchProfile form
// ══════════════════════════════════════════════════════════════════════════════

describe('Full drawer scenario — patchProfile form', () => {
    it('name field — text + placeholder', () => {
        render(FormField, { props: { ...base, type: 'text', placeholder: 'Kashley Vanrogoue' } });
        expect(screen.getByPlaceholderText('Kashley Vanrogoue').getAttribute('type')).toBe('text');
    });

    it('email field — email type + placeholder', () => {
        render(FormField, {
            props: {
                label: 'Email', id: 'email', name: 'email',
                type: 'email', placeholder: 'kashgallery@gmail.com',
            },
        });
        expect(screen.getByPlaceholderText('kashgallery@gmail.com').getAttribute('type')).toBe('email');
    });

    it('phone field — tel type + placeholder', () => {
        render(FormField, {
            props: {
                label: 'Phone', id: 'phone', name: 'phone',
                type: 'tel', placeholder: '+628123456789',
            },
        });
        expect(screen.getByPlaceholderText('+628123456789').getAttribute('type')).toBe('tel');
    });

    it('birthday field — date type', () => {
        render(FormField, {
            props: { label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt', type: 'date' },
        });
        expect(document.getElementById('birthdayAt')!.getAttribute('type')).toBe('date');
    });

    it('biography field — textarea + 3 rows', () => {
        render(FormField, {
            props: {
                label: 'Biography', id: 'biography', name: 'biography',
                type: 'textarea', rows: 3, placeholder: 'Tell us about yourself...',
            },
        });
        const ta = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(ta.tagName).toBe('TEXTAREA');
        expect(ta.getAttribute('rows')).toBe('3');
    });

    it('quote field — text type + placeholder', () => {
        render(FormField, {
            props: {
                label: 'Quote', id: 'quote', name: 'quote',
                type: 'text', placeholder: 'Your favorite quote',
            },
        });
        expect(screen.getByPlaceholderText('Your favorite quote').getAttribute('type')).toBe('text');
    });

    it('avatar field — file type + hint', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', hint: 'PNG, JPG or JPEG.', accept: '.jpg,.png,.jpeg',
            },
        });
        expect(screen.getByRole('button', { name: /choose avatar picture/i })).toBeTruthy();
        expect(screen.getByText('PNG, JPG or JPEG.')).toBeTruthy();
    });

    it('banner field — file type + hint', () => {
        render(FormField, {
            props: {
                label: 'Profile Banner', id: 'profileBanner', name: 'profileBanner',
                type: 'file', hint: 'PNG, JPG or JPEG.', accept: '.jpg,.png,.jpeg',
            },
        });
        expect(screen.getByRole('button', { name: /choose profile banner/i })).toBeTruthy();
        expect(screen.getByText('PNG, JPG or JPEG.')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 14. FILE + CROP INTEGRATION (B-04 — memory leak contract)
// ══════════════════════════════════════════════════════════════════════════════

describe('File + crop integration (B-04)', () => {
    it('onFileChange is called with the native Event when file changes', async () => {
        const onFileChange = vi.fn();
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', onFileChange,
            },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement;
        await fireEvent.change(nativeInput);
        expect(onFileChange).toHaveBeenCalledTimes(1);
        expect(onFileChange).toHaveBeenCalledWith(expect.any(Event));
    });

    it('FormField never calls URL.createObjectURL (parent responsibility)', () => {
        const spy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file',
            },
        });
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    it('FormField never calls URL.revokeObjectURL (parent responsibility)', () => {
        const spy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file',
            },
        });
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    it('displays cropped file name after parent injects new FileList', async () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file'
            },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement
        const file = new File(['binary'], 'avatar-cropped.jpg', { type: 'image/jpeg' })
        await fireEvent.change(nativeInput, { target: { files: [file] } })
        expect(screen.getByText('avatar-cropped.jpg')).toBeTruthy();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 15. ACCESSIBILITY
// ══════════════════════════════════════════════════════════════════════════════

describe('Accessibility', () => {
    it('file trigger button has an accessible aria-label', () => {
        render(FormField, {
            props: { label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        expect(screen.getByRole('button', { name: 'Choose Avatar Picture' })).toBeTruthy();
    });

    it('SVG icons inside file button are aria-hidden', () => {
        render(FormField, {
            props: { label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        const svg = document.querySelector('button svg');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('honeypot wrapper has aria-hidden=true', () => {
        render(FormField, {
            props: { label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        expect(document.querySelector('[aria-hidden="true"]')).toBeTruthy();
    });

    it('native file input has aria-hidden=true', () => {
        render(FormField, {
            props: { label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        expect(document.getElementById('avatarPicture')?.getAttribute('aria-hidden')).toBe('true');
    });
});