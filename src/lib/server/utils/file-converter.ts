import { MAX_RESIZE_DIMENSION } from "$lib/types/global/constant.types";
import { Result } from "$lib/types/global/result.types";
import sharp from "sharp";

export async function convertToWebpAsync(file: File)
    : Promise<Result<Buffer>> 
{

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const webpBuffer = await sharp(buffer)
            .resize(MAX_RESIZE_DIMENSION, MAX_RESIZE_DIMENSION, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 75 })
            .toBuffer();

        return Result.success(webpBuffer);
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: "IMAGE_CONVERSION_ERROR",
            description: err.message
        })
    }
}