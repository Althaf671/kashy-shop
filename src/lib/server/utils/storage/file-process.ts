import { Result, type TCloudinaryFile } from "$lib/types/global";
import { convertToWebpAsync } from "../converter/image-converter";
import { deleteFileByPublicIdAsync, uploadFileAsync } from "./file-upload";

//--- single upload -------------------
export async function processAndUploadImageAsync(rawFile: File): Promise<Result<TCloudinaryFile>> {
    const webpImage = await convertToWebpAsync(rawFile)
    if (webpImage.isFailure) {
        return Result.failure(webpImage.error)
    }

    const imagesMetadata = await uploadFileAsync(webpImage.value)
    if (imagesMetadata.isFailure) {
        return Result.failure(imagesMetadata.error)
    }

    return Result.success(imagesMetadata.value)
}

//--- multi upload --------------------
export async function processAndUploadMultiImagesAsync(
    thumbnail: File | undefined | null, 
    images: File[] | undefined | null
): Promise<Result<{ thumbnailResult: TCloudinaryFile | undefined , imagesResult: TCloudinaryFile[] }>> 
{
    const thumbnailTask = thumbnail !== undefined && thumbnail !== null
        ? processAndUploadImageAsync(thumbnail)
        : Promise.resolve(null)

    const imagesTask = images !== undefined && Array.isArray(images)
        ? images.map(file => processAndUploadImageAsync(file))
        : []

    const [thumbnailMetadata, ...imageMetadas] = await Promise.all([
        thumbnailTask,
        ...imagesTask
    ])

    if (thumbnailMetadata?.isFailure) return Result.failure(thumbnailMetadata.error)

    const failedImageUpload = imageMetadas.find(res => res.isFailure)
    if (failedImageUpload?.isFailure) return Result.failure(failedImageUpload.error)

    const thumbnailRes = thumbnailMetadata?.value ?? undefined
    const imagesRes = imageMetadas.map(res => res.value!)

    return Result.success({ thumbnailResult: thumbnailRes, imagesResult: imagesRes })
}

export async function cleanupPreviousFileAsync(
    thumbnail: TCloudinaryFile | undefined, 
    images?: TCloudinaryFile[] | undefined
) : Promise<void>
{
    if (thumbnail !== undefined)
        await deleteFileByPublicIdAsync(thumbnail.publicId).catch((error) => {
            console.warn("[WARNING]: Failed to delete previous file.", error)
        })

    if (images && images.length > 0)
        await Promise.all(
            images.map((file) => deleteFileByPublicIdAsync(file.publicId).catch((error) => {
                console.warn("[WARNING]: Failed to delete one or more previous files.", error)
            }))
        )
}