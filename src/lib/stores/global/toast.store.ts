// import { writable } from 'svelte/store';
// import { TOAST_TYPE } from "$lib/types/global/ui.types";

// export type Toast = { 
//     id: string; 
//     message: string; 
//     type: typeof TOAST_TYPE[keyof typeof TOAST_TYPE] 
// };

// export const toasts = writable<Toast[]>([]);

// export const addToast = (message: string, type: Toast['type']) => {
//     const id = crypto.randomUUID();
    
//     toasts.update((all) => [...all, { id, message, type }]);

//     setTimeout(() => {
//         toasts.update((all) => all.filter((t) => t.id !== id));
//     }, 5000);
// };

// export const removeToast = (id: string) => {
//     toasts.update((all) => all.filter((t) => t.id !== id));
// };