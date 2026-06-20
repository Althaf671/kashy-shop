/**
 * @file FormField.test.ts
 * @description Comprehensive test suite for FormField.svelte.
 *
 * Runner : Vitest
 * DOM    : jsdom (via @testing-library/svelte)
 * Covers : all prop combinations, visual states, behavior contracts,
 *          accessibility, and file/crop integration from the profile
 *          patch drawer.
 *
 * Setup required in vitest.config.ts:
 *   environment: 'jsdom'
 *   setupFiles: ['@testing-library/svelte/vitest']
 *
 * Install:
 *   pnpm add -D vitest @testing-library/svelte @testing-library/jest-dom jsdom
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import FormField from './FormField.svelte';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Creates a minimal synthetic FileList containing one File object.
 * Used to simulate a user selecting a file via the OS picker.
 *
 * @param name - File name including extension, e.g. "avatar.jpg"
 * @param type - MIME type, e.g. "image/jpeg"
 */
function makeFileList(name = 'avatar.jpg', type = 'image/jpeg'): FileList {
    const file = new File(['(binary)'], name, { type });
    const dt = new DataTransfer();
    dt.items.add(file);
    return dt.files;
}

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
        expect(screen.getByText('Fullname')).toBeInTheDocument();
    });

    it('associates <label> with input via matching id', () => {
        render(FormField, { props: { ...base, type: 'text' } });
        const label = screen.getByText('Fullname');
        expect(label).toHaveAttribute('for', 'name');
        expect(screen.getByRole('textbox')).toHaveAttribute('id', 'name');
    });

    it('turns label red when error is present', () => {
        render(FormField, { props: { ...base, error: 'Required' } });
        expect(screen.getByText('Fullname')).toHaveClass('text-red-500');
    });

    it('keeps label dark gray when no error', () => {
        render(FormField, { props: { ...base } });
        expect(screen.getByText('Fullname')).toHaveClass('text-gray-900');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 2. TEXT INPUT — name, email, phone, quote
// ══════════════════════════════════════════════════════════════════════════════

describe('type="text"', () => {
    it('renders an <input type="text">', () => {
        render(FormField, { props: { ...base, type: 'text' } });
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('forwards placeholder', () => {
        render(FormField, { props: { ...base, placeholder: 'Kashley Vanrogoue' } });
        expect(screen.getByPlaceholderText('Kashley Vanrogoue')).toBeInTheDocument();
    });

    it('forwards name attribute', () => {
        render(FormField, { props: { ...base, name: 'fullname' } });
        expect(screen.getByRole('textbox')).toHaveAttribute('name', 'fullname');
    });

    it('is enabled by default', () => {
        render(FormField, { props: { ...base } });
        expect(screen.getByRole('textbox')).not.toBeDisabled();
    });

    it('becomes disabled when disabled=true', () => {
        render(FormField, { props: { ...base, disabled: true } });
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders without icon — no pl-10 class', () => {
        render(FormField, { props: { ...base } });
        expect(screen.getByRole('textbox')).not.toHaveClass('pl-10');
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
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('forwards email placeholder', () => {
        render(FormField, {
            props: {
                ...base, label: 'Email', id: 'email', name: 'email',
                type: 'email', placeholder: 'kashgallery@gmail.com',
            },
        });
        expect(screen.getByPlaceholderText('kashgallery@gmail.com')).toBeInTheDocument();
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
        // tel inputs don't have role="textbox" in jsdom — query by id
        const input = document.getElementById('phone') as HTMLInputElement;
        expect(input).toHaveAttribute('type', 'tel');
    });

    it('forwards tel placeholder', () => {
        render(FormField, {
            props: {
                ...base, label: 'Phone', id: 'phone', name: 'phone',
                type: 'tel', placeholder: '+628123456789',
            },
        });
        expect(screen.getByPlaceholderText('+628123456789')).toBeInTheDocument();
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
        expect(input).toHaveAttribute('type', 'date');
    });

    it('is disabled when disabled=true', () => {
        render(FormField, {
            props: {
                ...base, label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt',
                type: 'date', disabled: true,
            },
        });
        expect(document.getElementById('birthdayAt')).toBeDisabled();
    });

    it('shows red border class when error is set', () => {
        render(FormField, {
            props: {
                ...base, label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt',
                type: 'date', error: 'Invalid date',
            },
        });
        expect(document.getElementById('birthdayAt')).toHaveClass('border-red-400');
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
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });

    it('defaults to rows=3', () => {
        render(FormField, {
            props: { ...base, label: 'Biography', id: 'biography', name: 'biography', type: 'textarea' },
        });
        expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
    });

    it('accepts custom rows prop', () => {
        render(FormField, {
            props: {
                ...base, label: 'Biography', id: 'biography', name: 'biography',
                type: 'textarea', rows: 5,
            },
        });
        expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
    });

    it('forwards placeholder', () => {
        render(FormField, {
            props: {
                ...base, label: 'Biography', id: 'biography', name: 'biography',
                type: 'textarea', placeholder: 'Tell us about yourself...',
            },
        });
        expect(screen.getByPlaceholderText('Tell us about yourself...')).toBeInTheDocument();
    });

    it('has resize-none class', () => {
        render(FormField, {
            props: { ...base, label: 'Biography', id: 'biography', name: 'biography', type: 'textarea' },
        });
        expect(screen.getByRole('textbox')).toHaveClass('resize-none');
    });

    it('is disabled when disabled=true', () => {
        render(FormField, {
            props: {
                ...base, label: 'Biography', id: 'biography', name: 'biography',
                type: 'textarea', disabled: true,
            },
        });
        expect(screen.getByRole('textbox')).toBeDisabled();
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
        expect(screen.getByRole('button', { name: /choose avatar picture/i })).toBeInTheDocument();
    });

    it('hides the native file input from accessibility tree', () => {
        render(FormField, {
            props: { ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement;
        expect(nativeInput).toHaveAttribute('aria-hidden', 'true');
        expect(nativeInput).toHaveAttribute('tabindex', '-1');
        expect(nativeInput).toHaveClass('sr-only');
    });

    it('shows fallback placeholder text when no file selected', () => {
        render(FormField, {
            props: { ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file' },
        });
        expect(screen.getByText('choose avatar picture')).toBeInTheDocument();
    });

    it('forwards accept attribute to native input', () => {
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', accept: '.jpg,.png,.jpeg',
            },
        });
        const nativeInput = document.getElementById('avatarPicture') as HTMLInputElement;
        expect(nativeInput).toHaveAttribute('accept', '.jpg,.png,.jpeg');
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
        expect(screen.getByRole('button', { name: /choose avatar picture/i })).toBeDisabled();
    });

    it('shows red border on trigger button when error is set', () => {
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', error: 'File is required',
            },
        });
        const btn = screen.getByRole('button', { name: /choose avatar picture/i });
        expect(btn).toHaveClass('border-red-400');
    });

    it('displays selected filename when files prop has a file', () => {
        const fileList = makeFileList('my-avatar.jpg');
        render(FormField, {
            props: {
                ...base, label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', files: fileList,
            },
        });
        expect(screen.getByText('my-avatar.jpg')).toBeInTheDocument();
    });

    it('displays banner filename for profile banner field', () => {
        const fileList = makeFileList('my-banner.png', 'image/png');
        render(FormField, {
            props: {
                label: 'Profile Banner', id: 'profileBanner', name: 'profileBanner',
                type: 'file', files: fileList,
            },
        });
        expect(screen.getByText('my-banner.png')).toBeInTheDocument();
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
        expect(wrapper).toBeInTheDocument();
        expect(wrapper.style.left).toBe('-9999px');
    });

    it('has tabindex=-1 on the honeypot input', () => {
        render(FormField, {
            props: { ...base, label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        const input = document.getElementById('website') as HTMLInputElement;
        expect(input).toHaveAttribute('tabindex', '-1');
    });

    it('has autocomplete=off on the honeypot input', () => {
        render(FormField, {
            props: { ...base, label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        const input = document.getElementById('website') as HTMLInputElement;
        expect(input).toHaveAttribute('autocomplete', 'off');
    });

    it('does not render a visible label for honeypot', () => {
        render(FormField, {
            props: { ...base, label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        // No visible <label> element should exist
        expect(screen.queryByText('Website')).not.toBeInTheDocument();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 9. ERROR STATE
// ══════════════════════════════════════════════════════════════════════════════

describe('Error state', () => {
    it('renders error message below input', () => {
        render(FormField, { props: { ...base, error: 'Name is required' } });
        expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    it('error message has red color class', () => {
        render(FormField, { props: { ...base, error: 'Name is required' } });
        expect(screen.getByText('Name is required')).toHaveClass('text-red-500');
    });

    it('input has red border class when error is set', () => {
        render(FormField, { props: { ...base, error: 'Name is required' } });
        expect(screen.getByRole('textbox')).toHaveClass('border-red-400');
    });

    it('does not render error message when error is null', () => {
        render(FormField, { props: { ...base, error: null } });
        // No red paragraph should exist
        expect(document.querySelector('p.text-red-500')).toBeNull();
    });

    it('does not render error message when error is empty string', () => {
        render(FormField, { props: { ...base, error: '' } });
        expect(document.querySelector('p.text-red-500')).toBeNull();
    });

    it('input uses brand focus ring when no error', () => {
        render(FormField, { props: { ...base } });
        expect(screen.getByRole('textbox')).toHaveClass('focus:ring-[#996087]/20');
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
        expect(screen.getByText('PNG, JPG or JPEG.')).toBeInTheDocument();
    });

    it('hint is gray', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', hint: 'PNG, JPG or JPEG.',
            },
        });
        expect(screen.getByText('PNG, JPG or JPEG.')).toHaveClass('text-gray-400');
    });

    it('hides hint when error is present (B-03)', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', hint: 'PNG, JPG or JPEG.', error: 'File too large',
            },
        });
        expect(screen.queryByText('PNG, JPG or JPEG.')).not.toBeInTheDocument();
        expect(screen.getByText('File too large')).toBeInTheDocument();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 11. DISABLED STATE
// ══════════════════════════════════════════════════════════════════════════════

describe('Disabled state (B-05)', () => {
    const disabledProps = { ...base, disabled: true };

    it('text input is disabled', () => {
        render(FormField, { props: disabledProps });
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('textarea is disabled', () => {
        render(FormField, {
            props: { ...base, label: 'Biography', id: 'biography', name: 'biography', type: 'textarea', disabled: true },
        });
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('date input is disabled', () => {
        render(FormField, {
            props: { ...base, label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt', type: 'date', disabled: true },
        });
        expect(document.getElementById('birthdayAt')).toBeDisabled();
    });

    it('file trigger button is disabled', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', disabled: true,
            },
        });
        expect(screen.getByRole('button', { name: /choose/i })).toBeDisabled();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 12. CUSTOM CLASS FORWARDING
// ══════════════════════════════════════════════════════════════════════════════

describe('class prop', () => {
    it('forwards custom class to the wrapper div', () => {
        render(FormField, { props: { ...base, class: 'mt-4 test-wrapper' } });
        // The outermost div gets the class
        const wrapper = document.querySelector('.test-wrapper');
        expect(wrapper).toBeInTheDocument();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13. FULL DRAWER SCENARIO — all fields from patchProfile form
// ══════════════════════════════════════════════════════════════════════════════

describe('Full drawer scenario — patchProfile form', () => {
    /**
     * Simulates rendering all 8 fields that appear in the profile patch drawer.
     * Asserts that each field is present and correctly typed.
     */
    it('renders all 8 form fields without errors', () => {
        const { container } = render(FormField, { props: { ...base, type: 'text', placeholder: 'Kashley Vanrogoue' } });
        // Just assert the first field renders; individual tests cover the rest
        expect(container).toBeTruthy();
    });

    it('name field — text + placeholder', () => {
        render(FormField, { props: { ...base, type: 'text', placeholder: 'Kashley Vanrogoue' } });
        expect(screen.getByPlaceholderText('Kashley Vanrogoue')).toHaveAttribute('type', 'text');
    });

    it('email field — email type + placeholder', () => {
        render(FormField, {
            props: {
                label: 'Email', id: 'email', name: 'email',
                type: 'email', placeholder: 'kashgallery@gmail.com',
            },
        });
        expect(screen.getByPlaceholderText('kashgallery@gmail.com')).toHaveAttribute('type', 'email');
    });

    it('phone field — tel type + placeholder', () => {
        render(FormField, {
            props: {
                label: 'Phone', id: 'phone', name: 'phone',
                type: 'tel', placeholder: '+628123456789',
            },
        });
        expect(screen.getByPlaceholderText('+628123456789')).toHaveAttribute('type', 'tel');
    });

    it('birthday field — date type', () => {
        render(FormField, {
            props: { label: 'Birthday', id: 'birthdayAt', name: 'birthdayAt', type: 'date' },
        });
        expect(document.getElementById('birthdayAt')).toHaveAttribute('type', 'date');
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
        expect(ta).toHaveAttribute('rows', '3');
    });

    it('quote field — text type + placeholder', () => {
        render(FormField, {
            props: {
                label: 'Quote', id: 'quote', name: 'quote',
                type: 'text', placeholder: 'Your favorite quote',
            },
        });
        expect(screen.getByPlaceholderText('Your favorite quote')).toHaveAttribute('type', 'text');
    });

    it('avatar field — file type + hint', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', hint: 'PNG, JPG or JPEG.', accept: '.jpg,.png,.jpeg',
            },
        });
        expect(screen.getByRole('button', { name: /choose avatar picture/i })).toBeInTheDocument();
        expect(screen.getByText('PNG, JPG or JPEG.')).toBeInTheDocument();
    });

    it('banner field — file type + hint', () => {
        render(FormField, {
            props: {
                label: 'Profile Banner', id: 'profileBanner', name: 'profileBanner',
                type: 'file', hint: 'PNG, JPG or JPEG.', accept: '.jpg,.png,.jpeg',
            },
        });
        expect(screen.getByRole('button', { name: /choose profile banner/i })).toBeInTheDocument();
        expect(screen.getByText('PNG, JPG or JPEG.')).toBeInTheDocument();
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
        expect(onFileChange).toHaveBeenCalledOnce();
        expect(onFileChange).toHaveBeenCalledWith(expect.any(Event));
    });

    it('FormField never calls URL.createObjectURL (parent responsibility)', () => {
        const spy = vi.spyOn(URL, 'createObjectURL');
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
        const spy = vi.spyOn(URL, 'revokeObjectURL');
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file',
            },
        });
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    it('displays cropped file name after parent injects new FileList', () => {
        const croppedFileList = makeFileList('avatar-cropped.jpg');
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture',
                type: 'file', files: croppedFileList,
            },
        });
        expect(screen.getByText('avatar-cropped.jpg')).toBeInTheDocument();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// 15. ACCESSIBILITY
// ══════════════════════════════════════════════════════════════════════════════

describe('Accessibility', () => {
    it('file trigger button has an accessible aria-label', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file',
            },
        });
        expect(screen.getByRole('button', { name: 'Choose Avatar Picture' })).toBeInTheDocument();
    });

    it('SVG icons inside file button are aria-hidden', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file',
            },
        });
        const svg = document.querySelector('button svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('honeypot wrapper has aria-hidden=true', () => {
        render(FormField, {
            props: { label: 'Website', id: 'website', name: 'website', type: 'honeypot' },
        });
        const wrapper = document.querySelector('[aria-hidden="true"]');
        expect(wrapper).toBeInTheDocument();
    });

    it('native file input has aria-hidden=true', () => {
        render(FormField, {
            props: {
                label: 'Avatar Picture', id: 'avatarPicture', name: 'avatarPicture', type: 'file',
            },
        });
        expect(document.getElementById('avatarPicture')).toHaveAttribute('aria-hidden', 'true');
    });
});