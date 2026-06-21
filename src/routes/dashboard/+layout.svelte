<script lang="ts">
    import Footer from '$lib/components/ui/footer/Footer.svelte';
    import Header from '$lib/components/ui/header/Header.svelte';
    import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte';
    import { HEADER_KEY } from '$lib/stores/global/context';
    import { type TSidebarProps } from '$lib/types/global/ui.types';
    import { Home01FreeIcons } from '@hugeicons/core-free-icons';
    import { setContext } from 'svelte';
    import Drawer from "$lib/components/ui/drawer/Drawer.svelte";
	import { drawer } from '$lib/stores/global/drawer.svelte.js';

    let { data, children } = $props();

    // header context
    let headerData = $state({ pageName: 'Admin Page', description: 'Manage your shop and order.' })
    setContext(HEADER_KEY, headerData);
    
    // sidebar props
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

<main class="w-screen h-screen overflow-hidden relative flex">
    <Sidebar content={sidebarItem} data={data.myProfile} />

    <div class="flex flex-col w-full h-screen bg-[#fbfaf6] pt-0 px-[1rem] md:px-[1.5rem] lg:px-[1.75rem] pb-[1.5rem] overflow-y-auto">
        <Header />
        {@render children()}
        <Footer />
    </div>
</main>

<Drawer bind:open={drawer.open} type={drawer.type} />