export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function getCroppedImg(imageSrc: string, pixelCrop: CropArea): Promise<Blob> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (error) => reject(error));
        img.setAttribute('crossOrigin', 'anonymous'); 
        img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg', 0.9);
    });
}

/**
 * Converts a FileList (or null) into a plain File[] array.
 * Used to populate the crop queue when user selects multiple files.
 *
 * @param fileList - The FileList from <input type="file" multiple>
 * @returns Plain array of File objects, or empty array if null.
 */
export function filesToQueue(fileList: FileList | null): File[] {
    if (!fileList || fileList.length === 0) return [];
    return Array.from(fileList);
}

/**
 * Creates a temporary object URL for a File to display in the crop modal.
 *
 * ⚠️ MEMORY CONTRACT: Caller MUST call URL.revokeObjectURL(url)
 * after the URL is no longer needed, or the file stays in memory
 * until page unload.
 *
 * @param file - The File to create an object URL for.
 * @returns A blob: URL string.
 */
export function fileToObjectUrl(file: File): string {
    return URL.createObjectURL(file);
}