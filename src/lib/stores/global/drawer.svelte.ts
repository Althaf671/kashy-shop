import type { TDrawerType } from '$lib/types/global/ui.types';

export const drawer = $state({
    open: false,
    type: 'notification' as TDrawerType
});

export function openDrawer(type: TDrawerType) {
    drawer.type = type;
    drawer.open = true;
}

export function closeDrawer() {
    drawer.open = false;
}