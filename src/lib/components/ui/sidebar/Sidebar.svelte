<script lang="ts">
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { 
        DashboardBrowsingIcon, Store04Icon, PackageIcon, 
        Setting07Icon, UserCircleIcon, Package02Icon,
		Logout01Icon, HelpCircleIcon
    } from '@hugeicons/core-free-icons';
    import { page } from '$app/state';
    import type { TSidebarProps } from "$lib/types/global/ui.types";
	import { enhance } from '$app/forms';

    let { content }: { content: TSidebarProps } = $props();
    let isCollapsed = $state(false);

    function toggleSidebar() { isCollapsed = !isCollapsed; }

    const menuConfig = {
        admin: {
            firstMenu: [
                { name: "Dashboard", path: "/dashboard", icon: DashboardBrowsingIcon },
                { name: "Shop", path: "/dashboard/shop-management", icon: Store04Icon },
                { name: "Order", path: "/dashboard/order-management", icon: Package02Icon },
            ],
            secondMenu: [
                { name: "Help", path: "/help", icon: HelpCircleIcon },
                { name: "Settings", path: "/dashboard/settings", icon: Setting07Icon },
            ],
        },
        shop: {
            firstMenu: [
                { name: "My Shop", path: "/shop/dashboard", icon: Store04Icon },
                { name: "Products", path: "/shop/products", icon: PackageIcon },
                { name: "Settings", path: "/shop/settings", icon: Setting07Icon },
            ],
            secondMenu: []
        },
        customer: {
            firstMenu: [
                { name: "Profile", path: "/customer/profile", icon: UserCircleIcon },
                { name: "Orders", path: "/customer/orders", icon: PackageIcon },
            ],
            secondMenu: []
        }
    };

    // Safe data retrieval
    let menuData = $derived(menuConfig[content.type] ?? { firstMenu: [], secondMenu: [] });
    let allMenuItems = $derived([...menuData.firstMenu, ...menuData.secondMenu]);
    let activeItemName = $derived(allMenuItems.find(i => i.path === page.url.pathname)?.name ?? "");

    const personalReminders = [
        "How was ur day Kashyy.",
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
    <div class="sidebar-header" class:header-collapsed={isCollapsed}>
        <button class="toggle-btn" onclick={toggleSidebar} aria-label="Toggle Sidebar">
            <div class="avatar">
                <div class="avatar-image-wrapper">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHwPbuEQl_EOvbH_tdI9JBD0qhccz_fvPkzg&s" alt="Logo" />
                </div>
            </div>
        </button>
        {#if !isCollapsed}
            <div class="brand-info">
                <span class="brand-name">HandyCraft</span>
                <span class="brand-email">@kashgallery24</span>
            </div>
        {/if}
    </div>

    <div class="sidebar-menu-container">
        <span class="nav-title" class:item-collapsed={isCollapsed}>MAIN MENU</span>
        <nav class="sidebar-menu">
            {#each menuData.firstMenu as item (item.name)}
                <a href={item.path} 
                   class="menu-item" 
                   class:active={activeItemName === item.name} 
                   class:item-collapsed={isCollapsed}>
                    <span class="icon-wrapper" class:active={activeItemName === item.name}>
                        <HugeiconsIcon icon={item.icon} size={22} color="currentColor" strokeWidth={1.65} />
                    </span>
                    {#if !isCollapsed}
                        <span class="menu-text">{item.name}</span>
                    {/if}
                </a>
            {/each}
        </nav>

        {#if menuData.secondMenu.length > 0}
            <span class="nav-title" style="margin-top: 2rem;" class:item-collapsed={isCollapsed}>ACCOUNT</span>
            <nav class="sidebar-menu" class:item-collapsed={isCollapsed}>
                {#each menuData.secondMenu as item (item.name)}
                    <a href={item.path} 
                       class="menu-item" 
                       class:active={activeItemName === item.name} 
                       class:item-collapsed={isCollapsed}>
                        <span class="icon-wrapper" class:active={activeItemName === item.name}>
                            <HugeiconsIcon icon={item.icon} size={22} color="currentColor" strokeWidth={1.65} />
                        </span>
                        {#if !isCollapsed}
                            <span class="menu-text">{item.name}</span>
                        {/if}
                    </a>
                {/each}

                <form method="POST" action="/?/logout" use:enhance class="logout-form">
                    <button type="submit" class="menu-item" class:item-collapsed={isCollapsed}>
                        <span class="icon-wrapper">
                            <HugeiconsIcon icon={Logout01Icon} size={22} color="currentColor" strokeWidth={1.65} />
                        </span>
                        {#if !isCollapsed}
                            <span class="menu-text">Sign Out</span>
                        {/if}
                    </button>
                </form>
            </nav>
        {/if}
    </div>

    {#if !isCollapsed && content.type === 'admin'}
        <div class="download-card">
            <button class="arrow-btn" aria-label="reminder-btn" onclick={changeReminder}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
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
        padding: 2.25rem 1.25rem 2rem 1.25rem;
        display: flex;
        flex-direction: column;
        color: #f4f3ee;
        font-family: 'Inter', sans-serif;
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
        padding-top: 0.5rem;
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

    .brand-info {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-top: 3px;
    }

    .brand-name { font-size: 1.3rem; font-weight: 600; white-space: nowrap; }
    .brand-email { font-size: 0.75rem; color: rgba(255, 255, 255, 0.45); }

    .sidebar-menu-container {
        display: flex;
        flex-direction: column;
        height: fit-content;
    }
    .sidebar-menu { display: flex; flex-direction: column; gap: 0.7rem; flex: 1; }
    .sidebar-menu.item-collapsed { margin-top: 3rem; }
    .nav-title { margin-left: 8px; opacity: 60%; font-size: 12px; margin-bottom: 5px; }
    .nav-title.item-collapsed { display: none; }

    .menu-item {
        background: none;
        border: none;
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        padding: 0.45rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s ease;
        font-size: 0.95rem;
        font-weight: 500;
        box-sizing: border-box;
    }

    .menu-item.item-collapsed { padding: 0.5rem 0; justify-content: center; }
    .menu-item:hover { color: #ffffff; background-color: rgba(255, 255, 255, 0.05); }
    .menu-item.active { background-color: #824C71; color: white; }

    .icon-wrapper { display: flex; align-items: center; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .icon-wrapper.active { rotate: -10deg; transform: scale(1.25); }
    .menu-item:not(.item-collapsed) .icon-wrapper { margin-right: 0.85rem; }
    .menu-text { flex: 1; white-space: nowrap; }

    .logout-form {
        width: 100%;
        margin: 0;
        padding: 0;
        display: flex;
    }

    .logout-form button {
        display: flex;
        align-items: center;
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        color: white;
        font-size: 0.95rem;
        font-weight: 500;
        padding: 0.45rem 1rem; 
        border-radius: 5px;
        transition: all 0.2s ease;
    }

    .logout-form button:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .logout-form button.item-collapsed {
        padding: 0.5rem 0;
        justify-content: center;
    }

    .download-card {
        background-color: #824C71;      
        border-radius: 8px;
        padding: 1rem 1.25rem;
        position: relative;
        color: #1a1c23;
        overflow: hidden;
        margin-top: auto;
        height: fit-content;
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
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .card-text { font-size: 0.95rem; font-weight: 700; width: 80%; color: white; margin-top: 1rem; }
    .mock-lines { display: flex; flex-direction: column; gap: 4px; width: 35px; margin-left: auto; }
    .line { height: 3px; background-color: rgba(14, 14, 14, 0.538); border-radius: 2px; }
    .line.decor-1 { width: 90%; }
    .line.decor-2 { width: 100%; }
</style>