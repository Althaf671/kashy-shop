export function getOptionalString(formData: FormData, key: string) {
    const value = formData.get(key) as string;
    return value && value.trim() !== "" ? value : undefined;
}

export function getOptionalFile(formData: FormData, key: string) {
    const file = formData.get(key);
    if (file instanceof File && file.size > 0) return file;
    return undefined;
}