<script lang="ts">
    import { HEADER_KEY, type THeaderData } from '$lib/stores/global/context.js';
    import { ArrowUpRight03Icon, Edit02Icon, LaptopIcon, Profile02Icon, ShieldKeyIcon } from '@hugeicons/core-free-icons';
    import { HugeiconsIcon } from '@hugeicons/svelte';
    import { getContext } from 'svelte';

    const headerData: THeaderData = getContext(HEADER_KEY);
    $effect(() => {
        headerData.pageName = "Settings Panel";
        headerData.description = "Manage your personal data and monitor sessions.";
    });
    
    const { data } = $props()
    const { mySessions, myProfile, error } = $derived(data)
</script>

<main class="flex flex-col gap-6 py-6">

    <!-- Profile Banner -->
    {#if myProfile === undefined} 
        <p>{error}</p>
    {:else}
        <div class="relative rounded-lg shadow-sm bg-white pb-3 overflow-hidden">
            <!-- Banner image -->
            <img src={myProfile.profileBanner?.fileUrl}
                    class="w-full h-56 object-cover block" alt="Profile Banner" />
            
            <!-- Avatar -->
            <div class="flex gap-3 ml-6 -mt-10">
                <img src={myProfile.avatarPicture.fileUrl} 
                        class="w-[105px] h-[105px] rounded-full p-1 bg-white shadow-sm" 
                        style="margin: -2rem 0 0 2rem; object-fit: cover;"
                        alt="{myProfile?.name} Profile Picture" />
                <div class="pt-[0.5rem]">
                    <p class="font-semibold text-[1.35rem]">{myProfile.name}</p>
                    <p class="text-[0.8rem] text-gray-400 -mt-1">{myProfile.email}</p>
                </div>
            </div>

            <form action="/?/edit" method="POST" class="absolute bottom-5 right-4">
                <button type="submit" class="text-sm bg-[#824C71] flex gap-1 text-[#f4f3ee] px-3 py-1.5 rounded-md cursor-pointer transition-colors">
                    Edit
                    <HugeiconsIcon 
                        icon={Edit02Icon} 
                        size={16} 
                        color="#f4f3ee" 
                        strokeWidth={1.65} 
                    />  
                </button>
            </form>
        </div>
    {/if}
    
    <!-- Information Container -->
    <div class="flex flex-col md:flex-row gap-6 w-full">
        
        <!-- Personal Info -->
        <div class="w-full md:w-[60%] bg-white rounded-lg shadow-sm p-6 min-h-[350px]">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6 pb-3">
                <!-- Icon Container -->
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <HugeiconsIcon 
                        icon={Profile02Icon} 
                        size={28} 
                        color="#7d7d7d" 
                        strokeWidth={1.65} 
                    />
                </div>
                
                <!-- Text Content -->
                <div class="flex flex-col">
                    <h3 class="text-xl font-bold text-gray-900">Personal Information</h3>
                    <p class="text-sm text-gray-500">A little about you</p>
                </div>
            </div>

            <!-- Separator -->
            <hr class="border-gray-200 mb-" />

            <!-- Grid Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 pt-[1.5rem]">
                
                <!-- Field 1 -->
                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-400 uppercase tracking-wide">Full Name</p>
                    <p class="text-sm font-medium text-gray-900">{myProfile?.name}</p>
                </div>

                <!-- Field 2 -->
                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-400 uppercase tracking-wide">Phone Number</p>
                    <p class="text-sm font-medium text-gray-900">{myProfile?.phone || '-'}</p>
                </div>

                <!-- Field 3 -->
                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-400 uppercase tracking-wide">E-mail Address</p>
                    <p class="text-sm font-medium text-gray-900">{myProfile?.email}</p>
                </div>

                <!-- Field 4 -->
                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-400 uppercase tracking-wide">Joined Date</p>
                    <p class="text-sm font-medium text-gray-900">{myProfile?.createdAt}</p>
                </div>

                <!-- Field 5 -->
                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-400 uppercase tracking-wide">Bio</p>
                    <p class="text-sm font-medium text-gray-900 w-[250px]">{myProfile?.biography}</p>
                </div>

                <!-- Field 6 -->
                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-400 uppercase tracking-wide">Birthday</p>
                    <p class="text-sm font-medium text-gray-900">{myProfile?.birthdayAt}</p>
                </div>

            </div>
        </div>

        <!-- Session List -->
        <div class="w-full md:w-[38%] bg-white rounded-lg shadow-sm flex flex-col min-h-[350px]">
            <!-- Header List -->
            <div class="flex items-center justify-between px-4 py-3 bg-[#824C71] text-[#f4f3ee] rounded-t-lg">
                <div class="flex items-center gap-1.5">
                    <HugeiconsIcon icon={ShieldKeyIcon} size={24} color="#f4f3ee" strokeWidth={1.65} />
                    <h3 class="text-md">Active Sessions</h3>
                </div>
                
                <form action="/?/logoutAll" method="POST">
                    <button type="submit" class="text-xs text-[#824C71] bg-white hover:bg-white/90 cursor-pointer px-2.5 py-1.25 rounded-md transition-colors">
                        Logout All
                    </button>
                </form>
            </div>

            <!-- List -->
            <div class="flex flex-col p-3 gap-3.5 overflow-y-auto">
                {#each mySessions as item (item)}
                    <div class="session-card border cursor-default border-gray-100 rounded-md px-3 py-2.5 flex items-center gap-3 relative hover:bg-gray-50 transition-colors">
                        <div class="flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100">
                            <HugeiconsIcon icon={LaptopIcon} size={28} color="#7d7d7d" strokeWidth={1.65} />
                        </div>
                        <div class="flex flex-col">
                            <h5 class="text-sm font-semibold text-gray-900">{item.device}</h5>
                            <p class="text-[0.75rem] text-gray-500">{item.os} - {item.browser}</p>
                            <p class="text-[0.75rem] text-gray-400">Expired in: {item.expiredAt}</p>
                        </div>
                        <div class="absolute right-3 bottom-3 text-gray-400 cursor-pointer">
                            <HugeiconsIcon icon={ArrowUpRight03Icon} size={18} />
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</main>