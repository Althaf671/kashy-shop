import type { TDrawerType } from "$lib/types/global/ui.types"; 

export function getDrawerTitle(type: TDrawerType | undefined | null): string {
    const titles: Record<TDrawerType, string> = {
        'notification': 'Notifications',
        'create-category-form': 'Create Category',
        'create-product-form': 'Create Product',
        'patch-category-form': 'Update Category',
        'patch-product-form': 'Update Product',
        'patch-profile-form': 'Update Profile',
    };

    return type ? (titles[type] ?? 'Menu') : 'Menu';
}