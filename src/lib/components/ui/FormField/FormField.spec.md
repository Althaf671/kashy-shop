# FormField.svelte — Component Specification

**Version:** 1.0.0  
**Stack:** Svelte 5 (runes), TypeScript, Tailwind CSS  
**Zero dependencies:** No Flowbite, no external UI library

---

## 1. Overview

`FormField` is a single universal field component that replaces all
`<Label>`, `<Input>`, `<Helper>`, and `<Textarea>` usages from Flowbite.
It handles every field variant needed by the profile patch form and any
future form in the app.

---

## 2. Supported Types

| `type` prop  | Renders                            | Binds to         |
|--------------|------------------------------------|------------------|
| `text`       | `<input type="text">`              | `value`          |
| `email`      | `<input type="email">`             | `value`          |
| `tel`        | `<input type="tel">`               | `value`          |
| `password`   | `<input type="password">`          | `value`          |
| `date`       | `<input type="date">`              | `value`          |
| `textarea`   | `<textarea>`                       | `textareaValue`  |
| `file`       | Hidden `<input>` + styled `<button>` | `files`, `inputRef` |
| `honeypot`   | `aria-hidden` off-screen input     | —                |

---

## 3. Props Reference

### Required

| Prop    | Type     | Description                                      |
|---------|----------|--------------------------------------------------|
| `label` | `string` | Visible label text rendered above the field.     |
| `id`    | `string` | HTML `id` — ties `<label for>` to the input.    |
| `name`  | `string` | HTML `name` used in form submission.             |

### Optional — General

| Prop          | Type                   | Default    | Description                                               |
|---------------|------------------------|------------|-----------------------------------------------------------|
| `type`        | `FieldType`            | `'text'`   | Determines which input variant is rendered.               |
| `value`       | `string` (bindable)    | `''`       | Bound value for single-line inputs and date.              |
| `textareaValue` | `string` (bindable)  | `''`       | Bound value specifically for `textarea`.                  |
| `placeholder` | `string`               | `''`       | Placeholder text shown when the field is empty.           |
| `error`       | `string \| null`       | `null`     | Validation message. Truthy → red border + message below. |
| `hint`        | `string`               | `''`       | Helper text in gray, hidden when `error` is truthy.       |
| `disabled`    | `boolean`              | `false`    | Disables interaction and mutes visual appearance.         |
| `rows`        | `number`               | `3`        | Visible row count for `textarea`.                         |
| `class`       | `string`               | `''`       | Extra Tailwind classes on the outermost wrapper `<div>`.  |

### Optional — File only

| Prop           | Type                          | Default | Description                                                            |
|----------------|-------------------------------|---------|------------------------------------------------------------------------|
| `accept`       | `string`                      | `''`    | File MIME / extension filter, e.g. `".jpg,.png,.jpeg"`.               |
| `files`        | `FileList \| null` (bindable) | `null`  | Bound FileList — read after crop processing is complete.               |
| `inputRef`     | `HTMLInputElement \| null` (bindable) | `null` | Ref to the hidden `<input type="file">`. Parent injects cropped FileList here. |
| `onFileChange` | `(e: Event) => void \| null`  | `null`  | Called on `change`. Parent uses this to open the crop modal.           |

### Optional — Content

| Prop   | Type      | Description                                                                     |
|--------|-----------|---------------------------------------------------------------------------------|
| `icon` | `Snippet` | Svelte 5 snippet rendered as a leading icon. Only applies to single-line types. |

---

## 4. Visual Specification

### Label
- Font: `text-sm font-semibold`
- Color: `text-gray-900` default, `text-red-500` when `error` is truthy
- Spacing: `mb-[5px]` below label, before input

### Input (text / email / tel / password / date)
- Background: `bg-gray-100`
- Border: `border border-gray-200`, radius `rounded-xl`
- Focus ring: `focus:ring-2 focus:ring-[#996087]/20 focus:border-[#996087]`
- Error state border: `border-red-400`, ring `focus:ring-red-400/20`
- Disabled: `bg-gray-50 text-gray-400 cursor-not-allowed`
- Padding: `px-3.5 py-2.5`
- With icon: `pl-10` (icon is `absolute left-3.5`)

### Textarea
- Inherits all input styles
- Extra: `resize-none leading-relaxed`
- Bound via `textareaValue` (separate from `value` to avoid prop collision)

### File trigger button
- Same border/radius/bg as input
- Contains: upload SVG icon + truncated filename or placeholder
- Placeholder text: `"Choose {label.toLowerCase()}"` in `text-gray-400`
- Selected text: `text-gray-900`
- Hidden native input: `sr-only`, `tabindex="-1"`, `aria-hidden="true"`

### Hint
- `text-xs text-gray-400 mt-1`
- Only visible when `error` is falsy

### Error message
- `text-xs text-red-500 mt-1.5`
- Replaces hint when `error` is truthy

### Honeypot
- Wrapped in `aria-hidden="true"` `<div>`
- Positioned `absolute left:-9999px`, `width:1px height:1px overflow:hidden`
- `tabindex="-1"` `autocomplete="off"`

---

## 5. Behavior Contracts

### B-01 — Label association
The `<label for={id}>` must always match the input's `id`. Screen readers
and click-to-focus must work on all types except `file` (which uses
`aria-label` on the button instead).

### B-02 — Error state is purely visual
`FormField` never sets or clears `error` itself. It only renders what the
parent passes. Validation logic lives in the form action / SvelteKit loader.

### B-03 — Error supersedes hint
When `error` is truthy, the `hint` element must not be in the DOM.

### B-04 — File crop integration (zero memory leak)
1. User picks file → `onFileChange` fires → parent creates object URL via
   `URL.createObjectURL()`.
2. Crop modal opens with that URL.
3. After crop, parent calls `URL.revokeObjectURL()` and injects a new
   `FileList` via `DataTransfer` into `inputRef.files` and `files`.
4. `FormField` never creates or revokes object URLs — that is the parent's
   responsibility.

### B-05 — Disabled blocks all interaction
When `disabled={true}`:
- `<input>` / `<textarea>` / `<button>` all receive `disabled` attribute.
- File button must not trigger `inputRef.click()`.
- Visual: `bg-gray-50`, `text-gray-400`, `cursor-not-allowed`.

### B-06 — Honeypot must never be visible or focusable
`tabindex="-1"`, positioned far off-screen, wrapped in `aria-hidden`.
Bots fill it; humans never see it. The form action checks if this field
has a value and rejects the submission if so.

### B-07 — textarea uses separate binding
`textareaValue` is kept separate from `value` so that a parent can bind
both a `<FormField type="text">` and a `<FormField type="textarea">`
without one overwriting the other.

### B-08 — Icon is optional, never breaks layout
If `icon` snippet is not passed, the input renders without left padding
offset (`pl-3.5` instead of `pl-10`). The icon span is not in the DOM.

---

## 6. Accessibility

| Concern                  | Implementation                                           |
|--------------------------|----------------------------------------------------------|
| Label–input association  | `<label for={id}>` on all visible types                  |
| File button label        | `aria-label="Choose {label}"` on the trigger `<button>` |
| Icon decorative          | `aria-hidden="true"` on all SVG icons                   |
| Honeypot hidden from AT  | `aria-hidden="true"` wrapper div                        |
| Keyboard focus           | Native elements; focus ring on all interactive states    |
| Error live region        | Parent should wrap form errors in `aria-live` if needed  |

---

## 7. Non-Goals

- `FormField` does **not** validate input.
- `FormField` does **not** manage crop state.
- `FormField` does **not** create object URLs.
- `FormField` does **not** submit forms.
- `FormField` does **not** import or depend on Flowbite.
-