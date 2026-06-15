import type { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions } from "apexcharts";

export const dataLabelColors = ["#996087", "#f7e6ce", "#efc9cc"] 

//--- Bar chart ---------------------
export const barChartDataPlaceholder: ApexAxisChartSeries = [
    { 
        name: "Sales",
        color: dataLabelColors[0],
        data: [
          { x: "Mon", y: 20 }, { x: "Tue", y: 4 }, { x: "Wed", y: 11 },
          { x: "Thu", y: 17 }, { x: "Fri", y: 25 }, { x: "Sat", y: 8 }, { x: "Sun", y: 14 }
        ]
    },
    { 
        name: "Visitors",
        color: dataLabelColors[2],
        data: [
          { x: "Mon", y: 36 }, { x: "Tue", y: 54 }, { x: "Wed", y: 28 },
          { x: "Thu", y: 47 }, { x: "Fri", y: 55 }, { x: "Sat", y: 27 }, { x: "Sun", y: 36 }
        ]
    },
    { 
        name: "Completed Orders",
        color: dataLabelColors[1],
        data: [
          { x: "Mon", y: 14 }, { x: "Tue", y: 7 }, { x: "Wed", y: 9 },
          { x: "Thu", y: 8 }, { x: "Fri", y: 15 }, { x: "Sat", y: 16 }, { x: "Sun", y: 11 }
        ]
    },
] as const

export const barChartOptions: ApexOptions = {
  colors: dataLabelColors,
  chart: {
      type: "bar",
      height: "180px",
      width: "100%", 
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      redrawOnParentResize: true, 
      redrawOnWindowResize: true,
      animations: {
        enabled: true,
        speed: 100,
        dynamicAnimation: {
          enabled: true,
          speed: 100
        }
      }
    },
  plotOptions: {
      bar: { 
        horizontal: false, 
        columnWidth: "65%", 
        borderRadiusApplication: "end", 
        borderRadius: 4, 
        rangeBarOverlap: false,
        dataLabels: {
          orientation: 'vertical',
        }
      }
    },
  grid: { show: false },
  dataLabels: { enabled: false },
  legend: { show: false },
  yaxis: { show: false },
  fill: { opacity: 1 }
} as const

//--- Donut chart -------------------
export const donutChartDataPlaceholder: ApexNonAxisChartSeries = [0.5, 0.2, 0.12]

export const donutChartLabelPlaceholder = ["Instagram", "Organic", "Shared Links"] 

export const donutChartOptions: ApexOptions = {
  colors: dataLabelColors,
  chart: {
    height: 215,
    width: "100%",
    type: "donut",
      redrawOnParentResize: true, 
      redrawOnWindowResize: true,
  },
  stroke: { colors: ["transparent"]},
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontFamily: "Inter, sans-serif",
            offsetY: 20
          },
          total: {
            showAlways: true,
            show: true,
            label: "Unique visitors",
            fontFamily: "Inter, sans-serif",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (w: any) {
              const sum = w.globals.seriesTotals.reduce((a: number, b: number) => { return a + b}, 0)
              return `${sum}k`
            }
          },
          value: {
            show: true,
            fontFamily: "Inter, sans-serif",
            offsetY: -20,
            formatter: function (value: unknown) { return value + "k"; }
          }
        },
        size: "80%"
      }
    }
  },
  grid: { padding: { top: -2 }},
  dataLabels: { enabled: false },
  legend: {
    position: "bottom",
    fontFamily: "Inter, sans-serif"
  },
  yaxis: { labels: { formatter: function (value: unknown) { return value + "k" }}},
  xaxis: {
    labels: { formatter: function (value: unknown) { return value + "k"; }},
    axisTicks: { show: false },
    axisBorder: { show: false }
  }
} as const