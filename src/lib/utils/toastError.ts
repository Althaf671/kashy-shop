import { messages } from "$lib/constants";
import type { TToastProps } from "$lib/types/global/ui.types";

export function toastError(props: TToastProps): TToastProps { 
    return {
        success: props.success,
        type: props.type,
        message: props.message || messages.SERVER_ERROR
    } as const
}