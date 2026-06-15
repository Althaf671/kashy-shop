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