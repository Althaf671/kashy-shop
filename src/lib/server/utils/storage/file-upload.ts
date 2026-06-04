import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Result,type TCloudinaryFile } from "$lib/types/global"; 
import { cloudinary } from "$lib/server/config/cloudinary";
import { FOLDER_NAME } from "$lib/constants";

export async function uploadFileAsync(buffer: Buffer)
    : Promise<Result<TCloudinaryFile>>
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

        const imageData: TCloudinaryFile = {
            publicId: uploadResult.public_id,
            fileUrl: uploadResult.secure_url
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

        return Result.success("File deleted successfully");

    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));

        return Result.failure({
            code: "FILE_DELETE_ERROR",
            description: err.message
        });
    }
}