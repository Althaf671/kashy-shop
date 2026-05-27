import { FOLDER_NAME } from "$lib/global/constant.type";
import { Result } from "$lib/global/shared.types";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/cloudinary";
import type { TCloudinaryImage } from "../db/schema.constraints";
import type { UploadApiErrorResponse } from "cloudinary";

export async function uploadFileAsync(buffer: Buffer)
    : Promise<Result<TCloudinaryImage>>
{
    try {
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: FOLDER_NAME,
                    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(new Error(error.message));
                    }
                    
                    if (!result) {
                        return reject(new Error("Success to upload but it did not return anything."));
                    }

                    resolve(result);
            });
            
            uploadStream.end(buffer);
        });

        const imageData: TCloudinaryImage = {
            publicId: uploadResult.public_id,
            imageUrl: uploadResult.secure_url
        }

        return Result.success(imageData)
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: "FILE_UPLOAD_ERROR",
            description: err.message
        })
    }
}

export async function deleteFileByPublicIdAsync(publicId: string)
    : Promise<Result<string>>
{
    try {
        const res = await cloudinary.uploader.destroy(publicId);

        if (res.result !== 'ok') {
            return Result.failure({
                code: "FILE_DELETE_ERROR",
                description: `Failed to delete file or file not found. Status: ${res.result}`
            });
        }

        return Result.success("Image deleted successfully");

    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: "FILE_DELETE_ERROR",
            description: err.message
        });
    }
}