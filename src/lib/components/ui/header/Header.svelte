<script lang="ts">
    import { getContext, onDestroy } from 'svelte';
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { 
        Logout01Icon, 
        Notification01Icon,
        Search01Icon 
    } from '@hugeicons/core-free-icons';
	import { HEADER_KEY, type THeaderData } from '$lib/stores/global/context';
	import { enhance } from '$app/forms';

    // search
    let searchQuery = $state("");

    // title props
    const header: THeaderData = getContext(HEADER_KEY);

    // clock
    let currentTime = $state("");
    let currentDate = $state("");

    function updateClock() {
        const now = new Date();
        
        currentTime = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit'
        }).replace(/:/g, '.'); 

        currentDate = now.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<header class="header-container">
    <div class="welcome-section">
        <h1 class="main-title">{header.pageName}</h1>
        <p class="sub-title">{header.description}</p>
    </div>

    <div class="right-section">

        <div class="datetime-display">
            <span class="time-text">{currentTime}</span>
            <span class="divider">|</span>
            <span class="date-text">{currentDate}</span>
        </div>

        <div class="controls-row">
            
            <div class="search-box">
                <span class="search-icon">
                    <HugeiconsIcon icon={Search01Icon} size={18} color="#9ca3af" strokeWidth={2} />
                </span>
                <input 
                    type="text" 
                    placeholder="Search by keywords..." 
                    bind:value={searchQuery}
                />
            </div>

            <button class="action-btn" title="Notifications">
                <div class="icon-dot-wrapper">
                    <HugeiconsIcon icon={Notification01Icon} size={20} color="#1a1c23" strokeWidth={1.8} />
                    <span class="notification-dot"></span>
                </div>
            </button>

            <form method="POST" action="/?/logout" use:enhance class="action-btn logout">
                <button type="submit" aria-label="logout button">
                    <HugeiconsIcon 
                        icon={Logout01Icon} 
                        size={20} 
                        color="#1a1c23" 
                        strokeWidth={1.8} 
                    />
                </button>
            </form>
        </div>
    </div>
</header>

<style>
    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0 1rem 0;
        background-color: transparent;
        font-family: 'Inter', sans-serif;
        box-sizing: border-box;
        width: 100%;
        max-height: 200px;
        border-bottom: 0.5px solid rgba(128, 128, 128, 0.3);
    }

    .welcome-section {
        display: flex;
        flex-direction: column;
        gap: 0.05rem;
        margin-top: 10px;
    }

    .main-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1a1c23;
        margin: 0;
        letter-spacing: -0.5px;
        line-height: 1.1;
        padding-top: 1.5rem;
    }

    .sub-title {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0;
        font-weight: 400;
    }

    .right-section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
        margin-top: 20px;
    }

    .datetime-display {
        font-size: 0.88rem;
        color: #6b7280;
        font-weight: 500;
        display: flex;
        align-items: center;
        letter-spacing: -0.1px;
        width: fit-content;
        margin-bottom: -3px;
    }

    .time-text {
        font-weight: 700;
        color: #1a1c23; /* Jam tebal hitam */
        font-variant-numeric: tabular-nums;
    }

    .divider {
        color: #d1d5db;

    }

    /* BARIS BAWAH: Controls Wrapper */
    .controls-row {
        display: flex;
        align-items: center;
        gap: 0.65rem;
    }

    /* Search Box Kapsul Kotak */
    .search-box {
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 5px;
        padding: 0.55rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 240px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    }

    .search-icon {
        display: flex;
        align-items: center;
    }

    .search-box input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 0.88rem;
        color: #1a1c23;
        width: 100%;
        font-family: inherit;
    }

    .search-box input::placeholder {
        color: #9ca3af;
    }

    /* Tombol Aksi Kotak Minimalis (Notif & Logout) */
    .action-btn {
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        padding: 0;
    }

    .action-btn:hover {
        background-color: #f9fafb;
        border-color: #d1d5db;
    }

    /* Hover khusus untuk logout */
    .action-btn.logout:hover {
        background-color: #fee2e2;
        border-color: #fca5a5;
    }
    
    /* Efek Dot Notifikasi merah di pojok kanan atas ikon lonceng */
    .icon-dot-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-dot {
        position: absolute;
        top: -1px;
        right: 0px;
        width: 7px;
        height: 7px;
        background-color: #ef4444; /* Warna merah indikator */
        border-radius: 50%;
        border: 1px solid #ffffff;
    }

    /* Responsive Layout */
    @media (max-width: 768px) {
        .header-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
        }
        .right-section {
            width: 100%;
            align-items: flex-start;
        }
        .controls-row {
            width: 100%;
        }
        .search-box {
            flex: 1;
        }
    }
</style>