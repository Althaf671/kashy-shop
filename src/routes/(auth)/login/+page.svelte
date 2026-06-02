<script lang="ts">
    // Di Svelte 5, kita ambil 'page' dari '$app/state', bukan '$app/stores' lagi
    import { page } from '$app/state';

    // page.url di sini sudah otomatis reactive object berkat keajaiban Runes!
    // Kita bisa langsung panggil getter-nya di HTML tanpa perlu penanda '$' di depan.
</script>

<h1>Sign in</h1>

{#if page.url.searchParams.get('error')}
    <div style="color: #b91c1c; background-color: #fee2e2; border: 1px solid #fca5a5; padding: 0.75rem 1rem; border-radius: 0.375rem; margin-bottom: 1rem; max-width: 300px;">
        ⚠️ <strong>Akses Ditolak:</strong> {page.url.searchParams.get('error')}
    </div>
{/if}

<a href="/login/google" rel="external">Sign in with Google</a>