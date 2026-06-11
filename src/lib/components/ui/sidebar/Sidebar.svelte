<script lang="ts">
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { 
        DashboardBrowsingIcon, Store04Icon, PackageIcon, 
        Setting07Icon, UserCircleIcon, Package02Icon
    } from '@hugeicons/core-free-icons';
    import { page } from '$app/state';
    import type { TSidebarProps } from "$lib/types/global/ui.types";

    // sidebar toggle
    let { content }: { content: TSidebarProps } = $props();
    let isCollapsed = $state(false);
    function toggleSidebar() { isCollapsed = !isCollapsed; }

    // Menu configurations
    const menuConfig = $derived({
        admin: [
            { name: "Dashboard", path: "/dashboard", icon: DashboardBrowsingIcon },
            { name: "Shop", path: "/dashboard/shop-management", icon: Store04Icon },
            { name: "Order", path: "/dashboard/order-management", icon: Package02Icon },
            { name: "Settings", path: "/dashboard/settings", icon: Setting07Icon },
        ],
        shop: [
            { name: "My Shop", path: "/shop/dashboard", icon: Store04Icon },
            { name: "Products", path: "/shop/products", icon: PackageIcon },
            { name: "Settings", path: "/shop/settings", icon: Setting07Icon },
        ],
        customer: [
            { name: "Profile", path: "/customer/profile", icon: UserCircleIcon },
            { name: "Orders", path: "/customer/orders", icon: PackageIcon },
        ]
    });

    // assign items
    let menuItems = $derived(menuConfig[content.type]);
    let brandEmail = $derived(`@${content.type}24`);
    let activeItem = $derived(menuItems.find(item => item.path === page.url.pathname)!.name)

    // reminder 
    const personalReminders = [
        "How are u Kashyy.",
        "Have you drink some water huh.",
        "Don't overthink, take it easy.",
        "Hope u doing alright.",
        "Nerdy medical kid.",
    ];
    let currentReminderIndex = $state(0);
    function changeReminder() {
        currentReminderIndex = (currentReminderIndex + 1) % personalReminders.length;
    }
</script>

<aside class="sidebar-container" class:collapsed={isCollapsed}>
    <!-- header -->
    <div class="sidebar-header" class:header-collapsed={isCollapsed}>
        <button class="toggle-btn" onclick={toggleSidebar}>
            <div class="avatar">
                <div class="avatar-image-wrapper">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHwPbuEQl_EOvbH_tdI9JBD0qhccz_fvPkzg&s" alt="Logo" />
                </div>
            </div>
        </button>
        {#if !isCollapsed}
            <div class="brand-info">
                <span class="brand-name">Kashy Handcraft</span>
                <span class="brand-email">{brandEmail}</span>
            </div>
        {/if}
    </div>

    <span class="nav-title" class:item-collapsed={isCollapsed}>MAIN</span>

    <!-- menu items -->
    <nav class="sidebar-menu">
        {#each menuItems as item (item.name)}
        <a href={item.path}>
            <button class="menu-item" class:active={activeItem === item.name} class:item-collapsed={isCollapsed}>
                <span class="icon-wrapper" class:active={activeItem === item.name}>
                    <HugeiconsIcon icon={item.icon} size={22} color="currentColor" strokeWidth={1.65} />
                </span>
                {#if !isCollapsed}
                    <span class="menu-text">{item.name}</span>
                {/if}
            </button>
        </a>
        {/each}
    </nav>

    <!-- reminder -->
    {#if !isCollapsed && content.type === 'admin'}
        <div class="download-card">
            <button class="arrow-btn" aria-label="reminder-btn" onclick={changeReminder}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </button>
            <div class="card-content">
                <p class="card-text">{personalReminders[currentReminderIndex]}</p>
                <div class="mock-lines">
                    <div class="line decor-1"></div><div class="line decor-2"></div>
                </div>
            </div>
        </div>
    {/if}
</aside>

<style>
    .sidebar-container {
        width: 300px;
        height: 100vh;
        background-color: #1E1E24;
        padding: 2.5rem 1.25rem 2rem 1.25rem;
        display: flex;
        flex-direction: column;
        color: #ffffff;
        font-family: 'Inter', sans-serif;
        box-sizing: border-box;
        justify-content: space-between;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
        box-shadow: 0 30px 100px rgba(26, 28, 35, 0.1);
    }

    .sidebar-container.collapsed {
        width: 78px;
        padding: 2rem 0.75rem;
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding-left: 0.5rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 0.5px solid rgba(128, 128, 128, 0.3);
    }

    .sidebar-header.header-collapsed {
        padding-left: 0;
        justify-content: center;
    }

    .brand-info {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-top: 3px;
    }

    .brand-name {
        font-size: 1.3rem;
        font-weight: 600;
        letter-spacing: -0.5px;
        white-space: nowrap;
        line-height: 1.2;
    }

    .brand-email {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.45);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: 0.05rem;
    }

    .toggle-btn {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        transition: transform 0.2s ease;
    }

    .toggle-btn:hover {
        transform: scale(1.06);
    }

    .avatar-image-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
    }

    .avatar-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .sidebar-menu {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        flex: 1;
    }

    .nav-title {
        margin-left: 8px;
        opacity: 60%;
        font-size: 12px;
        margin-bottom: 5px;
    }

    .nav-title.item-collapsed {
        display: none;
    }

    .menu-item {
        background: none;
        border: none;
        color: white;
        display: flex;
        align-items: center;
        padding: 0.45rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: all 0.2s ease;
        font-size: 0.95rem;
        font-weight: 500;
        box-sizing: border-box;
    }

    .menu-item.item-collapsed {
        padding: 0.5rem 0;
        justify-content: center;
    }

    .menu-item:hover {
        color: #ffffff;
        background-color: rgba(255, 255, 255, 0.05);
    }

    .menu-item.active {
        background-color: #824C71;
        color: white;
    }

    .icon-wrapper {
        display: flex;
        align-items: center;
        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
    }

    .icon-wrapper.active {
        rotate: -10deg;
        transform: scale(1.25);
    }

    .menu-item:not(.item-collapsed) .icon-wrapper {
        margin-right: 0.85rem;
    }

    .menu-text {
        flex: 1;
        white-space: nowrap;
    }

    .download-card {
        background-color: #824C71;      
        border-radius: 8px;
        padding: 1.25rem;
        position: relative;
        color: #1a1c23;
        overflow: hidden;
        margin-top: auto;
    }

    .arrow-btn {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 42px;
        height: 42px;
        background-color: #ffffff;
        border: 4px solid #1a1c23;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .arrow-btn:hover {
        transform: translateX(-50%) scale(1.1) rotate(45deg);
    }

    .card-content {
        position: relative;
        padding-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .card-text {
        font-size: 0.95rem;
        font-weight: 700;
        line-height: 1.3;
        max-width: 65%;
        margin: 0;
        min-height: 40px; 
        display: flex;
        align-items: center;
        color: white;
    }

    .mock-lines {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 35px;
    }

    .line {
        height: 3px;
        background-color: rgba(17, 17, 17, 0.365);
        border-radius: 2px;
    }

    .line.decor-1 { width: 90%; background-color: rgba(14, 14, 14, 0.538); }
    .line.decor-2 { width: 100%; }
</style>