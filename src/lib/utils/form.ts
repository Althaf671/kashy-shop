// [FATAL ERROR]: NEED TO REVIEW THIS AI MADE SHI

// Fungsi helper simpel untuk membersihkan form data
export function getOptionalString(formData: FormData, key: string) {
    const value = formData.get(key) as string;
    return value && value.trim() !== "" ? value : undefined;
}

// Khusus untuk file
export function getOptionalFile(formData: FormData, key: string) {
    const file = formData.get(key);
    // Pastikan itu adalah File dan ukurannya > 0
    if (file instanceof File && file.size > 0) return file;
    return undefined;
}