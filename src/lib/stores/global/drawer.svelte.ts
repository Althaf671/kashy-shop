import type { TDrawerType } from '$lib/types/global/ui.types';

export const drawer = $state({
    open: false,
    type: 'notification' as TDrawerType,
    description: 'A form to create or update something.'
});

export function openDrawer(type: TDrawerType, description: string) {
    drawer.type = type;
    drawer.open = true;
    drawer.description = description
}

export function closeDrawer() {
    drawer.open = false;
}