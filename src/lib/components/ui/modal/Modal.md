# Modal.svelte

**Version:** 1.0.0  
**Stack:** Svelte 5 (runes), TypeScript, Tailwind CSS  
**Dependencies:** `Button.svelte`, `svelte-easy-crop`, `cropImage` util

---

## Overview

Universal modal component with three variants — one file, zero duplication.

| Variant     | Use case                                   | Button style |
|-------------|--------------------------------------------|--------------|
| `'info'`    | Cookie notice, announcements               | Primary (brand purple) |
| `'confirm'` | Logout warning, destructive confirmations  | Danger (red) |
| `'crop'`    | Avatar / banner image cropping             | Primary + loading state |

All variants share: dark overlay backdrop (`bg-black/60`), centered card (`rounded-xl shadow-xs`), X close button, fade transition.

---

## Usage

### Info modal
```svelte
<Modal
  bind:show={showCookieModal}
  type="info"
  message="We use cookies for improving user experience, analytics and marketing."
  confirmLabel="That's fine!"
  onConfirm={acceptCookies}
>
  {#snippet icon()}
    <CookieIcon size={48} />
  {/snippet}
</Modal>
```

### Confirm modal
```svelte
<Modal
  bind:show={showLogoutModal}
  type="confirm"
  message="You will be logged out immediately!"
  confirmLabel="Extend login"
  onConfirm={extendSession}
>
  {#snippet icon()}
    <AlertIcon size={48} />
  {/snippet}
</Modal>
```

### Crop modal (avatar)
```svelte
<Modal
  bind:show={showCropModal}
  type="crop"
  imageSrc={cropImageSrc}
  fileName={cropFileName}
  aspect={1}
  shape="round"
  onCropComplete={handleCropComplete}
/>
```

### Crop modal (banner)
```svelte
<Modal
  bind:show={showCropModal}
  type="crop"
  imageSrc={cropImageSrc}
  fileName={cropFileName}
  aspect={16 / 9}
  shape="rect"
  onCropComplete={handleCropComplete}
/>
```

---

## Props

### Shared

| Prop   | Type        | Default  | Description |
|--------|-------------|----------|-------------|
| `show` | `boolean`   | `false`  | Bindable. Controls visibility. |
| `type` | `ModalType` | `'crop'` | Variant: `'crop'` \| `'info'` \| `'confirm'` |

### Info & Confirm only

| Prop           | Type       | Default | Description |
|----------------|------------|---------|-------------|
| `icon`         | `Snippet`  | —       | HugeIcon or any SVG, rendered above message. |
| `message`      | `string`   | `''`    | Body text. Rendered as plain text — no HTML. |
| `confirmLabel` | `string`   | `'OK'`  | Button label. |
| `onConfirm`    | `() => void` | —     | Called on confirm click. Modal closes after. |

### Crop only

| Prop             | Type                    | Default   | Description |
|------------------|-------------------------|-----------|-------------|
| `imageSrc`       | `string`                | `''`      | Object URL of the image to crop. |
| `fileName`       | `string`                | `'image'` | Source filename — used for `{name}-cropped.jpg`. |
| `aspect`         | `number`                | `1`       | Crop aspect ratio. `1` = square, `16/9` = banner. |
| `shape`          | `'rect' \| 'round'`     | `'rect'`  | `'round'` for avatar, `'rect'` for banner. |
| `onCropComplete` | `(file: File) => void`  | —         | Called with the cropped `File` after Apply Crop. |

---

## Behavior Contracts

| Contract | Description |
|----------|-------------|
| **B-01** | `show=false` renders nothing — zero DOM footprint when closed. |
| **B-02** | Dark overlay (`bg-black/60`) always present when open — backgrounds are always dimmed. |
| **B-03** | X button always visible — always closeable. |
| **B-04** | Info/Confirm close on backdrop click. Crop does NOT (prevents accidental loss of crop state). |
| **B-05** | `onConfirm` is always optional — modal closes cleanly without it. |
| **B-06** | Confirm button fires `onConfirm` then sets `show = false`. |
| **B-07** | Info button = `variant="primary"` (brand purple). Confirm button = `variant="danger"` (red). |
| **B-08** | No `{@html}` anywhere — `message` and `confirmLabel` are plain text only. |
| **B-09** | Crop: backdrop click is blocked — user must use X or Apply Crop. |
| **B-10** | Object URL lifecycle managed by parent — Modal never calls `createObjectURL` or `revokeObjectURL`. |

---

## Design Tokens

| Element         | Value |
|-----------------|-------|
| Card radius     | `rounded-xl` |
| Card shadow     | `shadow-xs` |
| Card bg         | `bg-white` |
| Card max width  | `max-w-sm` (384px) |
| Overlay bg      | `bg-black/60` |
| Overlay blur    | `backdrop-blur-[2px]` |
| z-index         | `z-[60]` (above drawer z-50) |
| Info button     | `variant="primary"` → `bg-[#996087]` |
| Confirm button  | `variant="danger"` → `bg-red-600` |
| Crop button     | `variant="primary"` → `bg-[#996087]` |

---

## Accessibility

| Concern | Implementation |
|---------|----------------|
| Dialog role | `role="dialog" aria-modal="true"` on backdrop |
| Close button | `aria-label="Close"` on X button |
| Backdrop button | `aria-label="Close modal"` + `tabindex="-1"` (not in tab order) |
| Decorative icon | Snippet wrapper has `aria-hidden="true"` |
| SVG icons | `aria-hidden="true"` on all internal SVGs |
| Zoom range | `aria-label="Zoom level"` |

---

## Security

- No `{@html}` — `message` and `confirmLabel` rendered as text nodes only.
- Malicious strings in props cannot inject script or image elements.
- File `accept` attribute filtering is handled by `FormField` (parent).
- Object URL creation/revocation is handled by parent — Modal has zero URL lifecycle responsibility.

---

## Responsive

- `p-4` on backdrop — card never touches screen edge on 375px mobile.
- `w-full max-w-sm` on card — fills mobile, constrained on desktop.
- All buttons `fullWidth` — tap-friendly on mobile.
- Crop canvas `height: 300px` explicit style — consistent cross-browser.
-