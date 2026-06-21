<script lang="ts">
    import type { TFormErrors } from '$lib/types/global/ui.types';
    import { EnvelopeSolid, PhoneSolid, UserCircleOutline } from 'flowbite-svelte-icons';
    import { enhance } from '$app/forms';
    import { page } from '$app/state';
	import FormField from '../../formField/FormField.svelte';
	import Modal from '../../modal/Modal.svelte';
	import Button from '../../button/Button.svelte';
	import { FORM_ACTIONS, INPUT_TYPES } from '$lib/constants/index';

    // ─── Props ────────────────────────────────────────────────────────────────
    let { 
        open = $bindable() 
    }: { 
        open: boolean 
    } = $props();

    // ─── File states ──────────────────────────────────────────────────────────
    let avatarFiles = $state<FileList | null>(null)
    let bannerFiles = $state<FileList | null>(null)
    let avatarInputRef = $state<HTMLInputElement | null>(null)
    let bannerInputRef = $state<HTMLInputElement | null>(null)

    // ─── Form field states ────────────────────────────────────────────────────
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

    // ─── Error catcher ────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let formErrors = $derived((page.form as any)?.errors as TFormErrors)

    // ─── Crop modal states ────────────────────────────────────────────────────
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

    // ─── Form reset ───────────────────────────────────────────────────────────
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
  type="crop"
  imageSrc={cropImageSrc}
  fileName={cropFileName}
  aspect={cropAspect}
  shape={cropShape}
  onCropComplete={handleCropComplete}
/>

<form 
    method="POST" 
    action={FORM_ACTIONS.PATCH_PROFILE}
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
    <FormField
        label="Fullname"
        id="name"
        name="name"
        type={INPUT_TYPES.TEXT}
        placeholder="Kashley Vanrogue"
        bind:value={nameValue}
        error={formErrors?.name}
        disabled={updating}
    >
        {#snippet icon()}<UserCircleOutline />{/snippet}
    </FormField>

    <!-- email -->
    <FormField
        label="Email"
        id="email"
        name="email"
        type={INPUT_TYPES.EMAIL}
        placeholder="kashgallery24@gmail.com"
        bind:value={emailValue}
        error={formErrors?.email}
        disabled={updating}
    >
        {#snippet icon()}<EnvelopeSolid />{/snippet}
    </FormField>

    <!-- phone -->
    <FormField
        label="Phone"
        id="phone"
        name="phone"
        type={INPUT_TYPES.TEL}
        placeholder="+6281234567"
        bind:value={phoneValue}
        error={formErrors?.phone}
        disabled={updating}
    >
        {#snippet icon()}<PhoneSolid />{/snippet}
    </FormField>

    <!-- birthday -->
    <FormField
        label="Birthday"
        id="birthdayAt"
        name="birthdayAt"
        type={INPUT_TYPES.DATE}
        bind:value={birthdayValue}
        error={formErrors?.birthdayAt}
        disabled={updating}
    />

    <!-- biography -->
    <FormField
        label="Biography"
        id="biography"
        name="biography"
        type={INPUT_TYPES.TEXTAREA}
        placeholder="Tell about yourself..."
        rows={3}
        bind:textareaValue={biographyValue}
        error={formErrors?.biography}
        disabled={updating}
    />

    <!-- quote -->
    <FormField
        label="Quote"
        id="quote"
        name="quote"
        type={INPUT_TYPES.TEXT}
        placeholder="Whats is in your mind?"
        bind:value={quoteValue}
        error={formErrors?.quote}
        disabled={updating}
    />
    
    <!-- avatar picture -->
    <FormField
        label="Avatar Picture"
        id="avatarPicture"
        name="avatarPicture"
        type={INPUT_TYPES.FILE}
        accept=".jpg,.png,.jpeg"
        hint="PNG, JPG or JPEG."
        bind:files={avatarFiles}
        bind:inputRef={avatarInputRef}
        onFileChange={handleAvatarChange}
        error={formErrors?.avatarPicture}
        disabled={updating}
    />

    <!-- profile banner -->
    <FormField
        label="Profile Banner"
        id="profileBanner"
        name="profileBanner"
        type={INPUT_TYPES.FILE}
        accept=".jpg,.png,.jpeg"
        hint="PNG, JPG or JPEG."
        bind:files={bannerFiles}
        bind:inputRef={bannerInputRef}
        onFileChange={handleBannerChange}
        error={formErrors?.profileBanner}
        disabled={updating}
    />

    <div class="flex gap-3">
        <Button
            type="submit"
            size="lg"
            fullWidth
            loading={updating}
            loadingText="Updating..."
            disabled={isFormEmpty}
        >
            Update Profile
        </Button>
        <Button variant="secondary" size="lg" fullWidth disabled={updating} onclick={() => (open = false)}>
            Cancel
        </Button>
    </div>
</form>