<!--
  ─── Why this is safe by construction ──────────────────────────────────────

  1. NO `{@html}`, ANYWHERE.
     `icon`, `trailingIcon`, and `children` are Snippets (function references
     the parent compiles), never raw strings interpolated into markup. There
     is no string -> DOM path in this component, so there is no XSS surface
     to defend — unlike components that accept an `html` string prop.

  2. SAFE DEFAULTS THAT CAN'T BE SILENTLY OVERRIDDEN.
     `{...rest}` is spread FIRST on both the <a> and <button>. Every
     safety-relevant attribute (`type`, `disabled`, `href`, `rel`,
     `aria-disabled`, `onclick`) is declared AFTER the spread, so a stray
     prop from a caller (e.g. passing `disabled={false}` via rest by
     accident) can never win over the component's own computed values.

  3. `target="_blank"` ALWAYS GETS `rel="noopener noreferrer"`.
     Prevents the classic reverse-tabnabbing issue where the opened page
     can access `window.opener` and redirect the original tab.

  4. ONE GUARDED CLICK PATH FOR BOTH ELEMENT TYPES.
     `handleClick` is the only place `onclick` is ever invoked from. While
     `disabled || loading` is true it calls `preventDefault` /
     `stopPropagation` and returns — this is what actually makes a disabled
     `<a>` inert (native `disabled` doesn't exist on anchors, and
     `pointer-events: none` alone does not block keyboard/Enter activation
     or screen-reader "activate" gestures).

  5. `loading` IMPLIES `disabled` (`isDisabled = disabled || loading`).
     A user mashing "Export CSV" while the export is in flight cannot fire
     a second request — there's no separate "are we mid-request" flag for a
     caller to forget to check.

  6. NOTHING TO LEAK.
     No `addEventListener`, no `setTimeout`/`setInterval`, no module-level
     or global mutable state, no subscriptions. All reactivity is local
     `$derived`/`$props`. Svelte owns and tears down the only event
     listener (`onclick`) automatically when the element unmounts — there
     is no `onMount`/`onDestroy` pair to get out of sync, which is the most
     common source of memory leaks in component libraries.
-->