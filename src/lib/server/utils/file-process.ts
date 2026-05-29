import { Result, type TCloudinaryImage } from "$lib/types/global";
import { convertToWebpAsync } from "./file-converter";
import { uploadFileAsync } from "./file-upload";

export async function processAndUploadImageAsync(rawFile: File): Promise<Result<TCloudinaryImage>> {
    const webpImages = await convertToWebpAsync(rawFile)
    if (webpImages.isFailure) {
        return Result.failure(webpImages.error)
    }

    const imagesMetadata = await uploadFileAsync(webpImages.value)
    if (imagesMetadata.isFailure) {
        return Result.failure(imagesMetadata.error)
    }

    return Result.success(imagesMetadata.value)
}