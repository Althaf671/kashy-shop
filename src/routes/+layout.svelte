<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/ui/toast/Toast.svelte';
	import type { Snippet } from 'svelte';
    import '../app.css';

    let { data, children }: { 
        data: App.PageData, 
        children: Snippet<[]> } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="fixed top-5 right-5 z-[10000]">
    <Toast {data} />
</div>

{@render children()}
