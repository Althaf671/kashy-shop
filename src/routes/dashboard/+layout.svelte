<script lang="ts">
	import Footer from '$lib/components/ui/footer/Footer.svelte';
	import Header from '$lib/components/ui/header/Header.svelte';
	import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte';
	import { HEADER_KEY } from '$lib/stores/global/context';
	import type { TSidebarProps } from '$lib/types/global/ui.types';
	import { Home01FreeIcons } from '@hugeicons/core-free-icons';
	import { setContext } from 'svelte';

    let { children } = $props();

    // header context
    let headerData = $state({ pageName: 'Admin Page', description: 'Manage your shop and order.' })
    setContext(HEADER_KEY, headerData);
    
    // children props
    let sidebarItem: TSidebarProps = {
        type: "admin",
        item: [ 
            { url: "Dashboard", name: "/dashboard", icon: Home01FreeIcons },
            { url: "Shop", name: "/dashboard/shop-management", icon: Home01FreeIcons },
            { url: "Order", name: "/dashboard/order-management", icon: Home01FreeIcons },
            { url: "settings", name: "/dashboard/settings", icon: Home01FreeIcons },
        ]
    }
</script>

<main class="admin__panel">
    <Sidebar content={sidebarItem} />

    <div class="main-container">
        <Header />
        {@render children()}
        <Footer />
    </div>
</main>

<style>
    .admin__panel {
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        display: flex;
        gap: 0.1rem;
        overflow-y: hidden;
        background-color: rgb(237, 237, 237);
    }

    .main-container {
        display: flex;
        flex-direction:  column;
        width: 100%;
        height: 100vh;
        background-color: rgb(255, 255, 255);
        padding: 0 1.75rem 1.5rem 1.75rem;
        overflow-y: auto;
    }
</style>
