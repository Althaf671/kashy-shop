import type { THeaderData } from "$lib/stores/global/context";
import type { IconSvgElement } from "@hugeicons/svelte";

//--- Header Props ---------------
export interface IHeaderContext {
    set: (data: THeaderData) => { result: THeaderData }
}

//--- Sidebar Props --------------
export type ISidebarItem = {
    url: string, 
    name: string, 
    icon: IconSvgElement
}

export type TSidebarProps = 
    | { type: "admin", item: ISidebarItem[] }
    | { type: "shop", item: ISidebarItem[] }
    | { type: "customer", item: ISidebarItem[] }

//--- Card Props -----------------
export interface IMetricItem {
    name: string;
    value: number | string;
    icon: IconSvgElement;
    progress: {
        value: number;
        trend: "up" | "down" | "neutral";
    }
}

export interface IActionItem {
    name: string;
    icon: IconSvgElement;
    url: string;
}

export interface INotificationItem {
    name: string;
    type: string;
    content: string;
}

export type TCardProps = 
    | { type: "metric", item: IMetricItem }
    | { type: "action", item: IActionItem }
    | { type: "notification", item: INotificationItem }