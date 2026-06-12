<script lang="ts">
	import { HEADER_KEY, type THeaderData } from '$lib/stores/global/context.js';
	import { Heading } from 'flowbite-svelte';
	import { getContext } from 'svelte';


    // header props
    const headerData: THeaderData = getContext(HEADER_KEY);
    $effect(() => {
        headerData.pageName = "Settings Panel";
        headerData.description = "Manage your personal data and monitor sessions.";
    });
    
    const { data } = $props()
    const { myProfile, error } = $derived(data)

</script>

<main class="settings">

    <!-- profile banner -->
    {#if myProfile === undefined} 
        <p>{error}</p>
    {:else}
        <div class="profile-banner rounded-lg shadow-sm">
            <img src="https://i.redd.it/liyue-harbor-and-wangshu-inn-backgrounds-from-the-new-event-v0-fidyq5valih61.jpg?width=1707&format=pjpg&auto=webp&s=c20b13494e9b8b0d93166333953fa7eb2257dbe4" class="rounded-t-lg" alt="Profile Banner" />
            <div class="avatar-info">
                <img src={myProfile.avatarPicture.fileUrl} class="shadow-sm" alt="{myProfile?.name} Profile Picture" />
                <div class="info">
                    <p class="name">{myProfile.name}</p>
                    <p class="email">{myProfile.email}</p>
                </div>
            </div>
        </div>
    {/if}
    
    <!-- information -->
    <div class="information-container">
        <div class="personal-information rounded-lg shadow-sm">
            <Heading tag="h3" class="mb-4 text-xl font-[600] md:text-xl lg:text-xl">Personal Information</Heading>
            <p class="border-b-1">All information about you</p>
            <div class="info-content">
                <p>{myProfile?.name}</p>
                <p>{myProfile?.email}</p>
                <p>{myProfile?.phone}</p>
                <p>{myProfile?.createdAt}</p>
                <p>Hello this is my bio</p>
                <p>24 May 2006</p>
                <p>Quotes: mwehehe cookies</p>
            </div>
        </div>
        <div class="session-list rounded-lg shadow-sm"></div>
    </div>
</main>

<style>
    .settings {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-block: 1.5rem;
    }

    .profile-banner {
        position: relative;
        padding-bottom: 0.75rem;
        display: flex;
        flex-direction: column;
        background-color: white;
    }

    .profile-banner img {
        width: 100%;      
        height: 220px;
        object-fit: cover; 
        object-position: center; 
        display: block;    
    }

    .avatar-info {
        display: flex;
        gap: 0.75rem;
    }

    .avatar-info img {
        border-radius: 50%;
        width: 105px;
        height: 105px;
        padding: 3.5px;
        background-color: white;
        margin-top: -2.5rem;
        margin-left: 1.5rem;
    }

    .info {
        margin-top: 0.3rem;
    }

    .info .name {
        font-weight: 600;
        font-size: 1.35rem;
    }

    .info .email {
        font-size: 0.8rem;
        margin-top: -0.15rem;
        color: #7d7d7d;
    }

    .information-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 1.5rem;
    }

    .personal-information {
        width: 60%;
        background-color: white;
        height: 300px;
        padding: 1.25rem 1.5rem;
    }

    .session-list {
        width: 38%;
        background-color: white;
        height: 300px;
    }
</style>