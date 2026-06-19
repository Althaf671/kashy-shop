<script lang="ts">
	import { navigating } from '$app/state';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';
    import { HEADER_KEY, type THeaderData } from '$lib/stores/global/context.js';
	import { openDrawer } from '$lib/stores/global/drawer.svelte.js';
    import { 
        ArrowUpRight03Icon, 
        ComputerPhoneSyncIcon, 
        Edit02Icon, 
        LaptopIcon, 
        Profile02Icon, 
        ShieldKeyIcon, 
		SmartPhone02Icon, 
		Tablet01Icon

    } from '@hugeicons/core-free-icons';
    import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Button, Card, Heading } from 'flowbite-svelte';
    import { getContext } from 'svelte';

    // header props
    const headerData: THeaderData = getContext(HEADER_KEY);
    $effect(() => {
        headerData.pageName = "Settings Panel";
        headerData.description = "Manage your personal data and monitor sessions.";
    });
    
    const { data } = $props()
    const { mySessions, myProfile } = $derived(data)

    // loading state
    let isLoading = $derived(!!navigating.to)

    function getDeviceIcon(item: { device: string, os: string }) {
        const info = (item.device + " " + item.os).toLowerCase();
        
        if (info.includes("ipad") || info.includes("tablet")) return Tablet01Icon;
        if (info.includes("mobile") || info.includes("ios") || info.includes("android")) return SmartPhone02Icon;
        if (info.includes("pc") || info.includes("windows") || info.includes("mac") || info.includes("laptop")) return LaptopIcon;
        
        return ComputerPhoneSyncIcon; 
    }
</script>

<main class="flex flex-col gap-6 pt-6">

    <!-- Profile Banner -->
    {#if isLoading} 
        <Skeleton type='banner' />
    {:else if myProfile === undefined}
        <Skeleton type='banner' />
    {:else}
        <Card class="relative rounded-lg shadow-xs bg-white pb-3 overflow-visible">
            <img 
                src="https://i.redd.it/liyue-harbor-and-wangshu-inn-backgrounds-from-the-new-event-v0-fidyq5valih61.jpg?width=1707&format=pjpg&auto=webp&s=c20b13494e9b8b0d93166333953fa7eb2257dbe4"
                class="!w-full aspect-[4/1] object-cover block rounded-t-lg" 
                alt="Profile Banner" 
            />
            
            <div class="relative px-6">
                
                <div class="flex items-end gap-4 -mt-12 sm:-mt-16" style="margin-top: -2.5rem;">
                    
                    <img src={myProfile.avatarPicture.fileUrl} 
                        class="w-24 h-24 sm:w-[105px] sm:h-[105px] rounded-full border-4 border-white bg-white shadow-sm flex-shrink-0" 
                        style="object-fit: cover;"
                        alt="{myProfile?.name} Profile Picture" />
                    
                    <div class="pb-3">
                        <p class="font-semibold text-[1.2rem] sm:text-[1.35rem]">{myProfile.name}</p>
                        <p class="text-[0.75rem] sm:text-[0.8rem] text-gray-400 -mt-1">{myProfile.email}</p>
                    </div>
                </div>
            </div>

            <Button 
                onclick={() => openDrawer('patch-profile-form')}
                type="submit" 
                class="text-sm absolute bottom-5 right-4 bg-[#996087] flex gap-1 text-[#f4f3ee] px-3 py-1.5 shadow-sm rounded-md cursor-pointer transition-colors"
                title="Patch My Profile Form"
            >
                Edit
                <HugeiconsIcon 
                    icon={Edit02Icon} 
                    size={16} 
                    color="#f4f3ee" 
                    strokeWidth={1.65} 
                />  
            </Button>
        </Card>
    {/if}
    
    <!-- Information Container -->
    <div class="flex flex-col md:flex-row gap-6 w-full">
        
        <!-- Personal Info -->
        <Card class="w-full md:w-[60%] bg-white rounded-lg shadow-xs p-6 min-h-[350px]">
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
                    <Heading tag="h4" class="text-xl font-[500] text-gray-900">Personal Information</Heading>
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
        </Card>

        <!-- Session List -->
        <Card class="w-full md:w-[38%] bg-white rounded-lg shadow-xs flex flex-col min-h-[350px]">
            <!-- Header List -->
            <div class="flex items-center justify-between px-4 py-3 bg-[#996087] text-[#f4f3ee] rounded-t-lg">
                <div class="flex items-center gap-1.5">
                    <HugeiconsIcon icon={ShieldKeyIcon} size={24} color="#f4f3ee" strokeWidth={1.65} />
                    <Heading tag="h3" class="text-md text-[#f4f3ee] font-[500]">Active Sessions</Heading>
                </div>
                
                <form action="/?/logoutAll" method="POST">
                    <Button type="submit" class="text-xs text-[#996087] bg-white hover:bg-white/90 cursor-pointer px-2.5 py-1.25 rounded-md transition-colors">
                        Logout All
                    </Button>
                </form>
            </div>

            <!-- List -->
            <div class="flex flex-col p-3 gap-3.5 overflow-y-auto">
                {#each mySessions as item (item)}
                    <Card class="flex flex-row border cursor-default border-gray-100 shadow-xs rounded-md px-3 py-2.5 flex gap-3 relative hover:bg-gray-50 transition-colors">
                        <div class="flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100">
                            <HugeiconsIcon icon={getDeviceIcon(item)} size={28} color="#7d7d7d" strokeWidth={1.65} />
                        </div>
                        <div class="flex flex-col">
                            <Heading tag="h4" class="text-sm font-[500] text-gray-900">{item.device}</Heading>
                            <p class="text-[0.75rem] text-gray-500">{item.os} - {item.browser}</p>
                            <p class="text-[0.75rem] text-gray-400">Expired in: {item.expiredAt}</p>
                        </div>
                        <Button class="absolute border-none shadow-none -right-1 bottom-1 text-gray-400 cursor-pointer">
                            <HugeiconsIcon icon={ArrowUpRight03Icon} size={18} />
                        </Button>
                    </Card>
                {/each}
            </div>
        </Card>
    </div>
</main>