<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import type { TDrawerType, TFormErrors } from '$lib/types/global/ui.types';
    import { 
        CloseCircleOutline, 
        EnvelopeSolid, 
        PhoneSolid, 
        UploadOutline, 
        UserCircleOutline 
    } from 'flowbite-svelte-icons';
    import { enhance } from '$app/forms';
    import { page } from '$app/state';
    import { 
        Label, 
        Input, 
        Helper, 
        Textarea, 
        Spinner 
    } from 'flowbite-svelte';
    import Modal from '../modal/Modal.svelte';

    // State props
    let { open = $bindable(), type }: { open: boolean, type: TDrawerType } = $props()

    // File states 
    let avatarFiles = $state<FileList | null>(null)
    let bannerFiles = $state<FileList | null>(null)
    let avatarInputRef = $state<HTMLInputElement | null>(null)
    let bannerInputRef = $state<HTMLInputElement | null>(null)

    // File placeholder
    let avatarFileName = $derived(avatarFiles && avatarFiles.length > 0 ? avatarFiles[0].name : 'Choose avatar picture')
    let bannerFileName = $derived(bannerFiles && bannerFiles.length > 0 ? bannerFiles[0].name : 'Choose profile banner')

    // Submit form state
    let nameValue = $state('')
    let emailValue = $state('')
    let phoneValue = $state('')
    let birthdayValue = $state('')
    let biographyValue = $state('')
    let quoteValue = $state('')
    let updating = $state(false)

    let isFormEmpty = $derived(
        !nameValue.trim() &&
        !emailValue.trim() &&
        !phoneValue.trim() &&
        !birthdayValue &&
        !biographyValue.trim() &&
        !quoteValue.trim() &&
        (!avatarFiles || avatarFiles.length === 0) &&
        (!bannerFiles || bannerFiles.length === 0)
    )

    // Error catcher 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let formErrors = $derived((page.form as any)?.errors as TFormErrors)

    // Crop modal states
    let showCropModal = $state(false)
    let cropImageSrc = $state('')
    let cropFileName = $state('')
    let cropAspect = $state(1)
    let cropShape = $state<'rect' | 'round'>('round')
    let cropTarget = $state<'avatar' | 'banner' | null>(null)

    function fileToObjectUrl(file: File): string {
        return URL.createObjectURL(file)
    }

    function handleAvatarChange(e: Event) {
        const input = e.currentTarget as HTMLInputElement
        const file = input.files?.[0]
        if (!file) return

        cropImageSrc = fileToObjectUrl(file)
        cropAspect = 1
        cropFileName = file.name
        cropShape = 'round'
        cropTarget = 'avatar'
        showCropModal = true
        input.value = ''
    }

    function handleBannerChange(e: Event) {
        const input = e.currentTarget as HTMLInputElement
        const file = input.files?.[0]
        if (!file) return

        cropImageSrc = fileToObjectUrl(file)
        cropAspect = 16 / 9
        cropFileName = file.name
        cropShape = 'rect'
        cropTarget = 'banner'
        showCropModal = true

        input.value = ''
    }

    function handleCropComplete(file: File) {
        const dt = new DataTransfer()
        dt.items.add(file)

        if (cropTarget === 'avatar') {
            avatarFiles = dt.files
            if (avatarInputRef) avatarInputRef.files = dt.files
        } else if (cropTarget === 'banner') {
            bannerFiles = dt.files
            if (bannerInputRef) bannerInputRef.files = dt.files
        }

        URL.revokeObjectURL(cropImageSrc)
        cropTarget = null
    }

    // form reset
    $effect(() => {
        if (!open) {
            nameValue = ''
            emailValue = ''
            phoneValue = ''
            birthdayValue = ''
            biographyValue = ''
            quoteValue = ''
            avatarFiles = null
            bannerFiles = null
        }
    })
</script>

<!-- Crop Modal -->
<Modal
    bind:show={showCropModal}
    imageSrc={cropImageSrc}
    fileName={cropFileName}
    aspect={cropAspect}
    shape={cropShape}
    onCropComplete={handleCropComplete}
/>

{#if open}
    <button 
        type="button"
        onclick={() => !updating && (open = false)} 
        transition:fade={{ duration: 300 }}
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
        aria-label="Close drawer"
        disabled={updating}
    ></button>

    <div 
        transition:fly={{ x: 350, duration: 300, easing: quintOut }}
        class="fixed top-0 right-0 z-50 h-full w-[385px] bg-white shadow-2xl flex flex-col"
    >
        <div class="px-7 py-2.5 border-b border-gray-100 shrink-0">
            <div class="flex justify-between items-start mb-2">
                <h2 class="text-xl font-[600] text-gray-900">
                    {type === 'patch-profile-form' ? 'Update Profile' : 'Notifications'}
                </h2>
                <button 
                    onclick={() => open = false} 
                    disabled={updating}
                    class="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <CloseCircleOutline size="lg" />
                </button>
            </div>
            <p class="text-sm text-gray-500">Change your personal information.</p>
        </div>

        <div class="flex-1 overflow-y-auto px-7 py-4">
            {#if type === 'notification'}
                <div class="text-gray-500">No new notifications</div>
            {:else if type === 'patch-profile-form'}
                
                <form 
                    method="POST" 
                    action="?/patchProfile" 
                    enctype="multipart/form-data" 
                    class="space-y-5 flex flex-col gap-5"
                    use:enhance={() => { 
                        updating = true; 
                        return async ({ result, update }) => { 
                            await update();
                            updating = false; 
                            if (result.type === 'success') open = false;
                        }
                    }}
                >
                    <!-- fullname -->
                    <div>
                        <Label for="name" color={formErrors?.name ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">Fullname</Label>
                        <Input 
                            id="name" 
                            name="name" 
                            type="text" 
                            placeholder="Kashley Vanrogoue" 
                            bind:value={nameValue}
                            color={formErrors?.name ? 'red' : 'default'}
                            disabled={updating}
                            class="pl-9 shadow-xs text-gray-900 placeholder:text-gray-400"
                        >
                            {#snippet left()}
                                <UserCircleOutline class="h-5 w-5 text-gray-400 mr-3" /> 
                            {/snippet}
                        </Input>
                        {#if formErrors?.name}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.name}</Helper>
                        {/if}
                    </div>

                    <!-- email -->
                    <div>
                        <Label for="email" color={formErrors?.email ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">Email</Label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="kashgallery@gmail.com" 
                            bind:value={emailValue}
                            color={formErrors?.email ? 'red' : 'default'}
                            disabled={updating}
                            class="pl-9 shadow-xs text-gray-900 placeholder:text-gray-400"
                        >
                            {#snippet left()}
                                <EnvelopeSolid class="h-5 w-5 text-gray-400 mr-3" />
                            {/snippet}
                        </Input>
                        {#if formErrors?.email}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.email}</Helper>
                        {/if}
                    </div>

                    <!-- phone -->
                    <div>
                        <Label for="phone" color={formErrors?.phone ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">Phone</Label>
                        <Input 
                            id="phone" 
                            name="phone" 
                            type="text" 
                            placeholder="+628123456789" 
                            bind:value={phoneValue}
                            color={formErrors?.phone ? 'red' : 'default'}
                            disabled={updating}
                            class="pl-9 shadow-xs text-gray-900 placeholder:text-gray-400"
                        >
                            {#snippet left()}
                                <PhoneSolid class="h-5 w-5 text-gray-400 mr-3" />
                            {/snippet}
                        </Input>
                        {#if formErrors?.phone}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.phone}</Helper>
                        {/if}
                    </div>

                    <!-- birthday -->
                    <div>
                        <Label for="birthdayAt" color={formErrors?.birthdayAt ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">
                            Birthday
                        </Label>
                        
                        <input 
                            type="date" 
                            id="birthdayAt"
                            name="birthdayAt" 
                            bind:value={birthdayValue} 
                            disabled={updating}
                            class="w-full p-2.5 text-sm rounded-lg border bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition-colors shadow-xs
                                focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                                {formErrors?.birthdayAt 
                                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 text-red-900' 
                                    : 'border-gray-300 focus:ring-[#996087]/20 focus:border-[#996087]'}"
                        />

                        {#if formErrors?.birthdayAt}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.birthdayAt}</Helper>
                        {/if}
                    </div>

                    <!-- biography -->
                    <div>
                        <Label for="biography" color={formErrors?.biography ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">Biography</Label>
                        <Textarea 
                            id="biography" 
                            name="biography" 
                            rows={3} 
                            placeholder="Tell us about yourself..." 
                            bind:value={biographyValue}
                            color={formErrors?.biography ? 'red' : 'default'}
                            disabled={updating}
                            class="w-full text-sm text-gray-900 placeholder:text-gray-400 resize-none shadow-xs"
                        />
                        {#if formErrors?.biography}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.biography}</Helper>
                        {/if}
                    </div>

                    <!-- quote -->
                    <div style="margin-top: -8px;">
                        <Label for="quote" color={formErrors?.biography ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">Quote</Label>
                        <Input 
                            id="quote" 
                            name="quote" 
                            type="text" 
                            placeholder="Your favorite quote" 
                            bind:value={quoteValue}
                            disabled={updating}
                            class="text-gray-900 placeholder:text-gray-400 shadow-xs"
                        />
                        {#if formErrors?.quote}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.quote}</Helper>
                        {/if}
                    </div>
                    
                    <!-- avatar picture -->
                    <div>
                        <Label for="avatarPicture" color={formErrors?.avatarPicture ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">Avatar Picture</Label>
                        
                        <input 
                            type="file"
                            id="avatarPicture" 
                            name="avatarPicture"
                            accept=".jpg,.png,.jpeg"
                            bind:this={avatarInputRef} 
                            bind:files={avatarFiles}
                            onchange={handleAvatarChange}
                            disabled={updating}
                            class="hidden"
                        />

                        <button
                            type="button"
                            onclick={() => avatarInputRef?.click()}
                            disabled={updating}
                            class="w-full flex items-center text-left px-3 py-2.5 text-sm rounded-lg border bg-gray-50 shadow-xs transition-colors outline-none
                                focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed
                                {formErrors?.avatarPicture 
                                    ? 'border-red-500 focus:ring-red-500/20 text-red-900' 
                                    : 'border-gray-300 focus:ring-[#996087]/20 text-gray-900'}"
                        >
                            <UploadOutline class="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                            
                            <span class="truncate text-sm pl-1 {avatarFiles && avatarFiles.length > 0 ? 'text-gray-900' : 'text-gray-700'}">
                                {avatarFileName}
                            </span>
                        </button>

                        <Helper class="text-xs text-gray-400 mt-1">PNG, JPG or JPEG.</Helper>
                        {#if formErrors?.avatarPicture}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.avatarPicture}</Helper>
                        {/if}
                    </div>

                    <!-- profile banner -->
                    <div>
                        <Label for="profileBanner" color={formErrors?.profileBanner ? 'red' : 'primary'} style="margin-bottom: 2.5px;" class="mb-1.5 text-sm font-[500]">Profile Banner</Label>
                        
                        <input 
                            type="file"
                            id="profileBanner" 
                            name="profileBanner"
                            accept=".jpg,.png,.jpeg"
                            bind:this={bannerInputRef} 
                            bind:files={bannerFiles}
                            onchange={handleBannerChange}
                            disabled={updating}
                            class="hidden"
                        />

                        <button
                            type="button"
                            onclick={() => bannerInputRef?.click()}
                            disabled={updating}
                            class="w-full flex items-center text-left px-3 py-2.5 text-sm rounded-lg border bg-gray-50 shadow-xs transition-colors outline-none
                                focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed
                                {formErrors?.profileBanner 
                                    ? 'border-red-500 focus:ring-red-500/20 text-red-900' 
                                    : 'border-gray-300 focus:ring-[#996087]/20 text-gray-900'}"
                        >
                            <UploadOutline class="h-5 w-5 text-gray-400 shrink-0" />
                            
                            <span class="truncate text-sm pl-1 {bannerFiles && bannerFiles.length > 0 ? 'text-gray-900' : 'text-gray-700'}">
                                {bannerFileName}
                            </span>
                        </button>

                        <Helper class="text-xs text-gray-400 mt-1">PNG, JPG or JPEG.</Helper>
                        {#if formErrors?.profileBanner}
                            <Helper class="mt-1.5 text-xs" color="red">{formErrors.profileBanner}</Helper>
                        {/if}
                    </div>

                    <div class="flex gap-3 pt-4 border-t border-gray-100 mt-8">
                        <button 
                            type="submit" 
                            disabled={updating || isFormEmpty}
                            class="w-full py-2.5 bg-[#996087] shadow-xs text-white font-medium rounded-lg hover:bg-[#855376] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {#if updating}
                                <Spinner size="4" color='primary' />
                                <span>Updating...</span>
                            {:else}
                                Update Profile
                            {/if}
                        </button>
                        <button 
                            type="button" 
                            onclick={() => open = false} 
                            disabled={updating}
                            class="w-full shadow-xs py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            {/if}
        </div>
    </div>
{/if}