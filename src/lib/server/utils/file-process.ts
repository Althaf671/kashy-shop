import { Result, type TCloudinaryImage } from "$lib/types/global";
import { convertToWebpAsync } from "./file-converter";
import { uploadFileAsync } from "./file-upload";

export async function processAndUploadThumbnailAsync(rawFile: File): Promise<Result<TCloudinaryImage>> {
    const webpThumbnail = await convertToWebpAsync(rawFile)
    if (webpThumbnail.isFailure) {
        return Result.failure(webpThumbnail.error)
    }

    const thumbnailMetadata = await uploadFileAsync(webpThumbnail.value)
    if (thumbnailMetadata.isFailure) {
        return Result.failure(thumbnailMetadata.error)
    }

    return Result.success(thumbnailMetadata.value)
}