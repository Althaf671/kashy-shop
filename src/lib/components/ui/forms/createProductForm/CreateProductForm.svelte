<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { FORM_ACTIONS, INPUT_TYPES } from "$lib/constants";
	import type { TFormErrors } from "$lib/types/global/ui.types";
	import { fileToObjectUrl, filesToQueue } from "$lib/utils/cropImage";
	import { GlobeOutline, GridOutline } from "flowbite-svelte-icons";
	import Button from "../../button/Button.svelte";
	import FormField from "../../formField/FormField.svelte";
	import Modal from "../../modal/Modal.svelte";

    // ─── Props ────────────────────────────────────────────────────────────────
    let { 
        open = $bindable(),
        categories = [] as { id: string; name: string }[]
    }: { 
        open: boolean
        categories?: { id: string; name: string }[]
    } = $props(); 

    // ─── File states ──────────────────────────────────────────────────────────
    let thumbnailFile = $state<FileList | null>(null)
    let thumbnailInputRef = $state<HTMLInputElement | null>(null)

    // ─── Product images — multi-file crop queue ───────────────────────────────
    let productImagesInputRef = $state<HTMLInputElement | null>(null)
    let productCropQueue = $state<File[]>([])
    let croppedProductFiles = $state<File[]>([])

    // ─── Form field states ────────────────────────────────────────────────────
    let nameValue = $state('')
    let descriptionValue = $state('')
    let slugValue = $state('')    
    let priceValue = $state('')
    let stockValue = $state('')
    let typeValue = $state<'ready_stock' | 'pre_order'>('ready_stock')
    let categoryIdValue = $state('')
    let isActiveValue = $state(true)
    let updating = $state(false)

    let isFormEmpty = $derived(
        !nameValue.trim() &&
        !descriptionValue.trim() &&
        !slugValue.trim() &&
        !priceValue.trim() &&
        !stockValue.trim() &&
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

    // ─── Thumbnail handlers ───────────────────────────────────────────────────

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
        // ── thumbnail path ──
        if (productCropQueue.length === 0) {
            const dt = new DataTransfer()
            dt.items.add(file)
            thumbnailFile = dt.files
            if (thumbnailInputRef) thumbnailInputRef.files = dt.files
            URL.revokeObjectURL(cropImageSrc)
            return
        }

        // ── product images path ──
        croppedProductFiles = [...croppedProductFiles, file]
        URL.revokeObjectURL(cropImageSrc)
        productCropQueue = productCropQueue.slice(1)

        if (productCropQueue.length > 0) {
            openNextProductCrop()
        }
    }

    // ─── Product images handlers ──────────────────────────────────────────────

    function handleProductImagesChange(e: Event) {
        const input = e.currentTarget as HTMLInputElement
        const files = filesToQueue(input.files)
        if (!files.length) return

        productCropQueue = files
        input.value = ''
        openNextProductCrop()
    }

    function openNextProductCrop() {
        const file = productCropQueue[0]
        cropImageSrc = fileToObjectUrl(file)
        cropFileName = file.name
        cropAspect = 1
        cropShape = 'rect'
        showCropModal = true
    }

    function handleRemoveProductFile(index: number) {
        croppedProductFiles = croppedProductFiles.filter((_, i) => i !== index)
    }

    // ─── Form reset ───────────────────────────────────────────────────────────
    $effect(() => {
        if (!open) {
            nameValue = ''
            descriptionValue = ''
            slugValue = ''
            priceValue = ''
            stockValue = ''
            typeValue = 'ready_stock'
            categoryIdValue = ''
            isActiveValue = true
            thumbnailFile = null
            croppedProductFiles = []
            productCropQueue = []
        }
    })

    const categoryId = "014028ae-b526-4480-a155-c8e2ea459a16"
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
    action={FORM_ACTIONS.CREATE_PRODUCT}
    enctype="multipart/form-data"
    class="space-y-5 flex flex-col gap-5"
    use:enhance={({ formData }) => {
        croppedProductFiles.forEach((file, i) => {
            formData.append(`productImage_${i}`, file)
        })
        updating = true
        return async ({ result, update }) => { 
            await update();
            updating = false; 
            if (result.type === 'success') open = false;
        }
    }}
>
    <!-- name -->
    <FormField
        label="Name"
        id="name"
        name="name"
        type={INPUT_TYPES.TEXT}
        placeholder="Belonging Heart"
        bind:value={nameValue}
        error={formErrors?.name}
        disabled={updating}
    >
        {#snippet icon()}<GridOutline />{/snippet}
    </FormField>

    <!-- slug -->
    <FormField
        label="Slug"
        id="slug"
        name="slug"
        type={INPUT_TYPES.TEXT}
        placeholder="belonging-heart"
        bind:value={slugValue}
        error={formErrors?.slug}
        disabled={updating}
    >
        {#snippet icon()}<GlobeOutline />{/snippet}
    </FormField>

    <!-- description -->
    <FormField
        label="Description"
        id="description"
        name="description"
        type={INPUT_TYPES.TEXTAREA}
        placeholder="Tell your everyone about this product..."
        bind:textareaValue={descriptionValue}
        error={formErrors?.description}
        disabled={updating}
        rows={8}
    />

    <!-- price -->
    <FormField 
        label="Price"
        id="price"
        name="price"
        type={INPUT_TYPES.TEXT}
        placeholder="50000"
        bind:value={priceValue}
        error={formErrors?.price}
        disabled={updating}
    />

    <!-- stock -->
    <FormField 
        label="Stock"
        id="stock"
        name="stock"
        type={INPUT_TYPES.TEXT}
        placeholder="10"
        bind:value={stockValue}
        error={formErrors?.stock}
        disabled={updating}
    />

    <!-- type -->
    <div>
        <label for="type" class="block mb-[5px] text-sm font-semibold {formErrors?.type ? 'text-red-500' : 'text-gray-900'}">
            Type
        </label>
        <select
            id="type"
            name="type"
            bind:value={typeValue}
            disabled={updating}
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-gray-100 text-gray-900 outline-none transition-all duration-150
                {formErrors?.type
                    ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 focus:border-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-[#996087]/20 focus:border-[#996087]'}
                disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
            <option value="ready_stock">Ready Stock</option>
            <option value="pre_order">Pre Order</option>
        </select>
        {#if formErrors?.type}
            <p class="mt-1.5 text-xs text-red-500">{formErrors.type}</p>
        {/if}
    </div>

    <!-- category -->
    <div>
        <label for="categoryId" class="block mb-[5px] text-sm font-semibold {formErrors?.categoryId ? 'text-red-500' : 'text-gray-900'}">
            Category
        </label>
        <select
            id="categoryId"
            name="categoryId"
            bind:value={categoryIdValue}
            disabled={updating}
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-gray-100 text-gray-900 outline-none transition-all duration-150
                {formErrors?.categoryId
                    ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 focus:border-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-[#996087]/20 focus:border-[#996087]'}
                disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
            <option value="">Select category</option>
                <option value={categoryId}>My best painting</option>
        </select>
        {#if formErrors?.categoryId}
            <p class="mt-1.5 text-xs text-red-500">{formErrors.categoryId}</p>
        {/if}
    </div>

    <!-- isActive -->
    <div class="flex items-center gap-3">
        <input
            type="checkbox"
            id="isActive"
            name="isActive"
            bind:checked={isActiveValue}
            disabled={updating}
            class="w-4 h-4 accent-[#996087] cursor-pointer disabled:cursor-not-allowed"
        />
        <label for="isActive" class="text-sm font-semibold text-gray-900 cursor-pointer">
            Active
        </label>
    </div>

    <!-- thumbnail picture -->
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

    <!-- product images -->
    <FormField
        label="Product Images"
        id="productImages"
        name="productImages"
        type={INPUT_TYPES.FILE}
        accept=".jpg,.png,.jpeg"
        multiple
        maxFiles={5}
        hint="Up to 5 images. PNG, JPG or JPEG."
        bind:inputRef={productImagesInputRef}
        croppedFiles={croppedProductFiles}
        onFileChange={handleProductImagesChange}
        onRemoveFile={handleRemoveProductFile}
        error={formErrors?.productImages}
        disabled={updating}
    />

    <div class="flex gap-3">
        <Button
            type="submit"
            size="lg"
            fullWidth
            loading={updating}
            loadingText="Creating..."
            disabled={isFormEmpty}
        >
            Create
        </Button>
        <Button variant="secondary" size="lg" fullWidth disabled={updating} onclick={() => (open = false)}>
            Cancel
        </Button>
    </div>
</form>