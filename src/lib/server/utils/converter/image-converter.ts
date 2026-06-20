import type { TImagePreset } from "$lib/types/global";
import { Result } from "$lib/types/global/result.types";
import sharp from "sharp";

export async function convertToWebpAsync(file: File, preset: TImagePreset)
    : Promise<Result<Buffer>> 
{
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        let pipeline = sharp(buffer);

        if (preset === 'wide') {
            pipeline = pipeline.resize(1200, 300, { 
                fit: 'cover',
                position: 'top'
            });
        } else if (preset === 'square') {
            pipeline = pipeline.resize(400, 400, {
                fit: 'cover',
                position: 'center'
            });
        }

        const webpBuffer = await pipeline
            .webp({ 
                quality: 90,
                effort: 6 
            })
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