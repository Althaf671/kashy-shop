<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import type { TDrawerType } from '$lib/types/global/ui.types';
    import { CloseCircleOutline, EnvelopeSolid, UserCircleOutline } from 'flowbite-svelte-icons';

    // State props
    let { open = $bindable(), type }: { open: any, type: TDrawerType } = $props();

    // File states
    let avatarFiles = $state<FileList | null>(null);
    let bannerFiles = $state<FileList | null>(null);

    const getFileNames = (files: FileList | null) => 
        files ? Array.from(files).map(f => f.name).join(", ") : "No files selected";
</script>

{#if open}
    <button 
        type="button"
        onclick={() => open = false}
        transition:fade={{ duration: 300 }}
        class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        aria-label="Close drawer"
    ></button>

    <div 
        transition:fly={{ x: 350, duration: 300, easing: quintOut }}
        class="fixed top-0 right-0 z-50 h-full w-[420px] bg-white shadow-2xl flex flex-col"
    >
        <div class="px-6 py-4.5 border-b border-gray-100 shrink-0">
            <div class="flex justify-between items-start mb-2">
                <h2 class="text-xl font-[600] text-gray-900">
                    {type === 'patch-profile-form' ? 'Patch Profile' : 'Notifications'}
                </h2>
                <button onclick={() => open = false} class="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
                    <CloseCircleOutline size="lg" />
                </button>
            </div>
            <p class="text-sm text-gray-500">Update your personal information.</p>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
            {#if type === 'notification'}
                <div class="text-gray-500">No new notifications</div>
            {:else if type === 'patch-profile-form'}
                
                <form method="POST" action="?/patchProfile" enctype="multipart/form-data" class="space-y-6">
                    <div class="space-y-5 pb-[2rem] flex flex-col gap-3.5">
                        <div>
                            <label for="name" class="block text-sm font-[500] text-gray-700 mb-1.5" style="margin-bottom: 3px;">Fullname</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <UserCircleOutline class="h-5 w-5 text-gray-400" />
                                </div>
                                <input id="name" name="name" type="text" placeholder="Kashley Vanrogoue" 
                                    class="w-full text-sm pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996087] focus:border-[#996087] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-[500] text-gray-700 mb-1.5" style="margin-bottom: 3px;">Email</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <EnvelopeSolid class="h-5 w-5 text-gray-400" />
                                </div>
                                <input id="email" name="email" type="email" placeholder="kashgallery@gmail.com" 
                                    class="w-full text-sm pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996087] focus:border-[#996087] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="phone" class="block text-sm font-[500] text-gray-700 mb-1.5" style="margin-bottom: 3px;">Phone Number</label>
                            <input id="phone" name="phone" type="text" placeholder="+628123456789" 
                                class="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996087] focus:border-[#996087] outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label for="birthdayAt" class="block text-sm font-[500] text-gray-700 mb-1.5" style="margin-bottom: 3px;">Birthday</label>
                            <input id="birthdayAt" name="birthdayAt" type="date" 
                                class="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996087] focus:border-[#996087] outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label for="biography" class="block text-sm font-[500] text-gray-700 mb-1.5" style="margin-bottom: 3px;">Biography</label>
                            <textarea id="biography" name="biography" rows={3} placeholder="Tell us about yourself..." 
                                class="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996087] focus:border-[#996087] outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label for="quote" class="block text-sm font-[500] text-gray-700 mb-1.5" style="margin-bottom: 3px;">Quote</label>
                            <input id="quote" name="quote" type="text" placeholder="Your favorite quote" 
                                class="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996087] focus:border-[#996087] outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5" style="margin-bottom: 3px;">Avatar Picture</label>
                            <label class="flex items-center w-full border border-gray-300 rounded-lg cursor-pointer bg-white overflow-hidden hover:bg-gray-50 transition-colors">
                                <span class="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 border-r border-gray-300">Choose File</span>
                                <span class="px-3 py-2 text-sm text-gray-500 truncate flex-1">
                                    {avatarFiles && avatarFiles.length > 0 ? avatarFiles[0].name : 'No file chosen'}
                                </span>
                                <input name="avatarPicture" type="file" bind:files={avatarFiles} class="hidden" />
                            </label>
                            <p class="text-xs text-emerald-600 mt-1">
                                {avatarFiles && avatarFiles.length > 0 ? `Selected: ${avatarFiles[0].name}` : 'No files selected'}
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5" style="margin-bottom: 3px;">Profile Banner</label>
                            <label class="flex items-center w-full border border-gray-300 rounded-lg cursor-pointer bg-white overflow-hidden hover:bg-gray-50 transition-colors">
                                <span class="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 border-r border-gray-300">Choose File</span>
                                <span class="px-3 py-2 text-sm text-gray-500 truncate flex-1">
                                    {bannerFiles && bannerFiles.length > 0 ? bannerFiles[0].name : 'No file chosen'}
                                </span>
                                <input name="profileBanner" type="file" bind:files={bannerFiles} class="hidden" />
                            </label>
                            <p class="text-xs text-emerald-600 mt-1">
                                {bannerFiles && bannerFiles.length > 0 ? `Selected: ${bannerFiles[0].name}` : 'No files selected'}
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4 border-t border-gray-100 mt-8">
                        <button type="submit" 
                            class="w-full py-2.5 bg-[#996087] text-white font-medium rounded-lg hover:bg-[#855376] transition-colors shadow-sm cursor-pointer"
                        >
                            Update Profile
                        </button>
                        <button type="button" onclick={() => open = false} 
                            class="w-full py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            {/if}
        </div>
    </div>
{/if}