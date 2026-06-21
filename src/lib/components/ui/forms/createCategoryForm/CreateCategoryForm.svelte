<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { FORM_ACTIONS, INPUT_TYPES } from "$lib/constants";
	import type { TFormErrors } from "$lib/types/global/ui.types";
	import { GlobeOutline, GridOutline } from "flowbite-svelte-icons";
	import FormField from "../../formField/FormField.svelte";
	import Modal from "../../modal/Modal.svelte";
	import Button from "../../button/Button.svelte";


    // ─── Props ────────────────────────────────────────────────────────────────
    let { 
        open = $bindable() 
    }: { 
        open: boolean 
    } = $props(); 

    // ─── File states ──────────────────────────────────────────────────────────
    let thumbnailFile = $state<FileList | null>(null)
    let thumbnailInputRef = $state<HTMLInputElement | null>(null)

    // ─── Form field states ────────────────────────────────────────────────────
    let nameValue = $state('')
    let descriptionValue = $state('')
    let slugValue = $state('')
    let updating = $state(false)

    let isFormEmpty = $derived(
        !nameValue.trim() &&
        !descriptionValue.trim() &&
        !slugValue.trim() &&
        (!thumbnailFile || thumbnailFile.length === 0)
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

    function fileToObjectUrl(file: File): string {
        return URL.createObjectURL(file)
    }

    function handleThumbnailChange(e: Event) {
        const input = e.currentTarget as HTMLInputElement
        const file = input.files?.[0]
        if (!file) return

        cropImageSrc = fileToObjectUrl(file)
        cropAspect = 1
        cropFileName = file.name
        cropShape = 'rect'
        showCropModal = true
        input.value = ''
    }

    function handleCropComplete(file: File) {
        const dt = new DataTransfer()
        dt.items.add(file)

        thumbnailFile = dt.files
        if (thumbnailInputRef) thumbnailInputRef.files = dt.files

        URL.revokeObjectURL(cropImageSrc)
    }

    // ─── Form reset ───────────────────────────────────────────────────────────
    $effect(() => {
        if (!open) {
            nameValue = ''
            descriptionValue = ''
            slugValue = ''
            thumbnailFile = null
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
    action={FORM_ACTIONS.CREATE_CATEGORY}
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

    <!-- Name -->
    <FormField
        label="Name"
        id="name"
        name="name"
        type={INPUT_TYPES.TEXT}
        placeholder="My Painting"
        bind:value={nameValue}
        error={formErrors?.name}
        disabled={updating}
    >
        {#snippet icon()}<GridOutline />{/snippet}
    </FormField>

    <!-- Slug -->
    <FormField
        label="Slug"
        id="slug"
        name="slug"
        type={INPUT_TYPES.TEXT}
        placeholder="my-best-painting"
        bind:value={slugValue}
        error={formErrors?.slug}
        disabled={updating}
    >
        {#snippet icon()}<GlobeOutline />{/snippet}
    </FormField>

    <!-- Description -->
    <FormField
        label="Description"
        id="description"
        name="description"
        type={INPUT_TYPES.TEXTAREA}
        placeholder="Tell your everyone about this category..."
        bind:textareaValue={descriptionValue}
        error={formErrors?.description}
        disabled={updating}
        rows={8}
    >
        {#snippet icon()}<GridOutline />{/snippet}
    </FormField>

    <!-- thumbnail pciture -->
    <FormField
        label="Thumbnail Picture"
        id="thumbnailPicture"
        name="thumbnailPicture"
        type={INPUT_TYPES.FILE}
        accept=".jpg,.png,.jpeg"
        hint="PNG, JPG or JPEG."
        bind:files={thumbnailFile}
        bind:inputRef={thumbnailInputRef}
        onFileChange={handleThumbnailChange}
        error={formErrors?.thumbnailPicture}
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
            Create
        </Button>
        <Button variant="secondary" size="lg" fullWidth disabled={updating} onclick={() => (open = false)}>
            Cancel
        </Button>
    </div>
</form>