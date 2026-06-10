import { DashboardCircleIcon, DeliverySent01Icon, EuroCircleIcon, Package02Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/svelte";

export type TIconName = "sales" | "categories" | "products" | "orders"

export interface IIconInfo {
    icon: IconSvgElement
    size: number
}

const icons: Record<TIconName, IIconInfo> = {
    sales: { icon: EuroCircleIcon, size: 28 },
    categories: { icon: DashboardCircleIcon, size: 28 },
    products: { icon: Package02Icon, size: 28 },
    orders: { icon: DeliverySent01Icon, size: 28 }
}

export function getIconForMetric(name: string): IconSvgElement {
    const mapping: Record<string, TIconName> = {
        "Sales" : "sales",
        "Categories": "categories",
        "Active Products": "products",
        "Order Completed": "orders" 
    }

    const key = mapping[name] || "categories"
    return icons[key].icon
}