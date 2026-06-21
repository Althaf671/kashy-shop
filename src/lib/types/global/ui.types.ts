import type { THeaderData } from "$lib/stores/global/context";
import type { IconSvgElement } from "@hugeicons/svelte";
import type { 
    ApexChart, 
    ApexDataLabels,
    ApexFill,
    ApexGrid, 
    ApexLegend, 
    ApexNonAxisChartSeries, 
    ApexPlotOptions, 
    ApexStroke, 
    ApexXAxis, 
    ApexYAxis 
} from "apexcharts";

//--- App colors -----------------
export const APP_COLORS = {
    PRIMARY: '',
    LIGHT_PRIMARY: '#996087',
    ACCENT_BACKGROUND: '#fbf8ef',
    WHITE_BACKGROUND: '#ffffff',
    DARK_BACKGROUND:  '#1E1E24'
}

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

export interface ISessionItem {
    device: string;
    browser: string;
    os: string;
    expiredAt: string;
    ipAddress: string;
    lastActivity: string;
}

export type TCardProps = 
    | { type: "metric", item: IMetricItem }
    | { type: "action", item: IActionItem }
    | { type: "notification", item: INotificationItem }
    | { type: "session", item: ISessionItem }

//--- Chart Props ----------------
interface IChartData {
    x: string;
    y: number;
}

export interface IBarChartItem {
    name: string;
    color: string;
    data: IChartData[];
}

export interface IChartOptions {
    colors: string[];
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    grid: ApexGrid;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    fill?: ApexFill;
    stroke?: ApexStroke;
    labels?: string[];
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis | ApexYAxis[]
}

export type TChartProps = 
    | { type: "bar", barItem?: IBarChartItem }
    | { type: "donut", labels?: string[], donutItem?: ApexNonAxisChartSeries }

//--- Skeleton Props -------------
export type TSkeletonType = 
    | 'card' 
    | 'bar-chart' 
    | 'donut-chart'
    | 'banner' 
    | 'paragraf' 
    | 'heading'

//--- Drawer Props ---------------
export type TDrawerType = 
    | 'notification'
    | 'create-category-form'
    | 'create-product-form'
    | 'patch-category-form'
    | 'patch-product-form'
    | 'patch-profile-form'

//--- Toast Props ----------------
export type TToastProps = {
    success: boolean;
    type: TToastType;
    message: string | undefined;
}

export const TOAST_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFORMATION: 'information'
} as const

export type TToastType = typeof TOAST_TYPE[keyof typeof TOAST_TYPE]

//--- Form Errors ----------------
export type TFormErrors = {
    name?: string;
    email?: string;
    phone?: string;
    birthdayAt?: string;
    biography?: string;
    quote?: string;
    profileBanner?: string;
    avatarPicture?: string;
    
    // category
    description: string;
    thumbnailPicture: string;
    slug: string;
};