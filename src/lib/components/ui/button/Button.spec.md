# Button.svelte — Component Specification

**Version:** 1.0.0  
**Stack:** Svelte 5 (runes), TypeScript, Tailwind CSS  
**Zero dependencies:** No Flowbite, no external UI library

---

## 1. Overview

`Button` is a single universal button component that replaces all Flowbite
`<Button>` usage. Handles every button variant needed across the app:
primary CTA, secondary/outline, danger/destructive, ghost/icon-only,
link-style (`<a>`), and loading states with double-submit protection.

---

## 2. Variants

| `variant`     | Use case                                      | Visual                                      |
|---------------|-----------------------------------------------|---------------------------------------------|
| `primary`     | Main CTA (Update Profile, Export CSV)         | `bg-[#996087]` · light text · hover darker  |
| `secondary`   | Neutral action (Cancel, dropdown triggers)    | White bg · gray border · gray text          |
| `danger`      | Destructive (Delete, Remove)                  | `bg-red-600` · white text                   |
| `ghost`       | Lowest emphasis, icon-only row actions        | Transparent · no border · no shadow         |

---

## 3. Sizes

| `size` | Padding        | Font     | Use case                        |
|--------|----------------|----------|---------------------------------|
| `sm`   | `px-2.5 py-1.5`| `text-xs`| Dense UI, table row actions     |
| `md`   | `px-3 py-2`    | `text-sm`| Toolbar buttons (default)       |
| `lg`   | `px-4 py-2.5`  | `text-sm`| Full-width form actions         |

---

## 4. Props Reference

### Core

| Prop        | Type            | Default      | Description                                              |
|-------------|-----------------|--------------|----------------------------------------------------------|
| `variant`   | `ButtonVariant` | `'primary'`  | Visual style.                                            |
| `size`      | `ButtonSize`    | `'md'`       | Controls padding + font size.                            |
| `type`      | `ButtonType`    | `'button'`   | Native `type` — irrelevant when `href` is set.           |
| `disabled`  | `boolean`       | `false`      | Disables interaction, dims appearance.                   |
| `loading`   | `boolean`       | `false`      | Shows spinner, forces disabled — prevents double-submit. |
| `loadingText`| `string`       | `undefined`  | Text shown next to spinner during loading.               |
| `fullWidth` | `boolean`       | `false`      | Stretches button to `w-full`.                            |
| `iconOnly`  | `boolean`       | `false`      | Square padding, no text. Requires `ariaLabel`.           |

### Navigation

| Prop     | Type     | Default     | Description                                              |
|----------|----------|-------------|----------------------------------------------------------|
| `href`   | `string` | `undefined` | Renders `<a>` instead of `<button>`.                     |
| `target` | `string` | `undefined` | Forwarded to `<a>`. `_blank` auto-adds `rel` hardening.  |

### Accessibility

| Prop           | Type                          | Default     | Description                          |
|----------------|-------------------------------|-------------|--------------------------------------|
| `ariaLabel`    | `string`                      | `undefined` | Required for `iconOnly` buttons.     |
| `ariaExpanded` | `boolean`                     | `undefined` | For dropdown/panel toggles.          |
| `ariaHaspopup` | `boolean \| 'listbox' \| ...` | `undefined` | For popup-like widgets.              |

### Content (Snippets)

| Prop           | Type      | Description                                         |
|----------------|-----------|-----------------------------------------------------|
| `icon`         | `Snippet` | Leading icon (SVG/component). Hidden during loading.|
| `trailingIcon` | `Snippet` | Trailing icon (chevron for dropdowns).              |
| `children`     | `Snippet` | Button label text/content.                          |
| `class`        | `string`  | Extra Tailwind classes on root element.             |

---

## 5. Behavior Contracts

### B-01 — Loading implies disabled
When `loading=true`, `isDisabled` is always `true`. The button cannot be
clicked, focused-activated, or submitted regardless of the `disabled` prop.
This prevents double-submit on slow network requests.

### B-02 — Spinner replaces icon during loading
When `loading=true`, the leading `icon` snippet is NOT rendered. The spinner
SVG takes its place. The `trailingIcon` is also hidden during loading.

### B-03 — loadingText replaces children during loading
When `loading=true` AND `loadingText` is provided, the children slot is
replaced by `loadingText`. If `loadingText` is not provided, children are
hidden (spinner only).

### B-04 — `<a>` is truly inert when disabled
For link buttons (`href` set), `disabled` is enforced via:
- `aria-disabled="true"`
- `tabindex="-1"` (removes from tab order)
- `pointer-events-none` CSS class
- `handleClick` guard that calls `e.preventDefault()` + `e.stopPropagation()`

CSS `pointer-events: none` alone is insufficient for keyboard navigation
(Enter key still fires click on focused `<a>`). The `handleClick` guard is
the definitive stop.

### B-05 — `target="_blank"` always gets `rel="noopener noreferrer"`
Computed in `relValue`. Cannot be weakened by the caller — it is only ever
added, never overridden.

### B-06 — No `{@html}` anywhere
Zero markup injection surface. All content flows through typed Svelte snippets.

### B-07 — `type="button"` default prevents accidental form submit
Only overridden when the parent explicitly passes `type="submit"`.

### B-08 — `onclick` never fires when disabled or loading
`handleClick` is the single chokepoint for both `<button>` and `<a>` modes.
`onclick` prop is called only after the disabled guard passes.

### B-09 — `iconOnly` requires `ariaLabel`
When `iconOnly=true`, no visible text is rendered. `ariaLabel` must be
provided by the caller for screen reader accessibility.

---

## 6. Design Tokens

| Token      | Value                    |
|------------|--------------------------|
| Radius     | `rounded-lg`             |
| Shadow     | `shadow-xs` (ghost: none)|
| Primary bg | `#996087`                |
| Primary hover | `#824C71`             |
| Primary text | `#f4f3ee`              |
| Secondary text | `#636363`            |
| Secondary border | `#e5e7eb`          |
| Disabled   | `opacity-50`             |

---

## 7. Accessibility

| Concern                  | Implementation                                              |
|--------------------------|-------------------------------------------------------------|
| Disabled `<a>`           | `aria-disabled` + `tabindex=-1` + click guard              |
| Loading state            | `aria-busy="true"` on root element                         |
| Icon-only                | `ariaLabel` prop → `aria-label` on root                    |
| Spinner                  | `aria-hidden="true"` on spinner SVG                        |
| Icon snippets            | Wrapped in `aria-hidden` spans (decorative)                |
| Dropdown trigger         | `ariaExpanded` + `ariaHaspopup` forwarded                  |
| Focus ring               | `focus-visible:ring-2` — keyboard only, not mouse          |

---

## 8. Non-Goals

- `Button` does **not** manage its own loading state.
- `Button` does **not** perform navigation logic.
- `Button` does **not** import or depend on Flowbite.
- `Button` does **not** use `{@html}`.
- `Button` does **not** add event listeners in `onMount`/`onDestroy`.
-