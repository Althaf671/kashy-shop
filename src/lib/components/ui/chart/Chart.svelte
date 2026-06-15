<!-- IT FINALLY WORKS PROPERLY (ig)-->
<script lang="ts">
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { ChartColumnBigIcon } from "@hugeicons/core-free-icons";
  import { Chart } from "@flowbite-svelte-plugins/chart";
	import type { ApexOptions } from "apexcharts";
	import type { TChartProps } from "$lib/types/global/ui.types";
  import { 
    Card, 
    A, 
    Button, 
    Dropdown, 
    DropdownItem, 
    Popover 
  } from "flowbite-svelte";
  import { 
    ArrowUpOutline, 
    ChevronDownOutline, 
    ChevronRightOutline, 
    InfoCircleSolid 
  } from "flowbite-svelte-icons";
	import { 
    barChartOptions, 
    barChartDataPlaceholder, 
    dataLabelColors, 
    donutChartDataPlaceholder, 
    donutChartOptions, 
    donutChartLabelPlaceholder 
  } from "./config";

  let { options }: { options: TChartProps } = $props()

  let barOptions: ApexOptions = $derived({
    series: options.type === "bar" && options.barItem !== undefined
      ? options.barItem 
      : barChartDataPlaceholder,
    colors: barChartOptions.colors,
    chart: barChartOptions.chart,
    plotOptions: barChartOptions.plotOptions,
    grid: barChartOptions.grid,
    dataLabels: barChartOptions.dataLabels,
    legend: barChartOptions.legend,
    yaxis: barChartOptions.yaxis,
    fill: barChartOptions.fill
  })

  const donutOptions: ApexOptions = $derived({
    series: options.type === "donut" && options.donutItem !== undefined
      ? options.donutItem 
      : donutChartDataPlaceholder,
    labels: options.type === "donut" && options.labels !== undefined
      ? options.labels
      : donutChartLabelPlaceholder,
    colors: dataLabelColors,
    chart: donutChartOptions.chart,
    stroke: donutChartOptions.stroke,
    plotOptions: donutChartOptions.plotOptions,
    grid: donutChartOptions.grid,
    dataLabels: donutChartOptions.dataLabels,
    legend: donutChartOptions.legend,
    yaxis: donutChartOptions.yaxis,
    xaxis: donutChartOptions.xaxis
  }) 
</script>

{#if options.type === "bar"}
  <Card class="p-4 md:p-6 bg-base-100 shadow-xs rounded-lg w-full overflow-hidden min-w-0 bg-white"> 
    <div class="mb-4 flex justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="me-3 flex h-12 w-12 p-3 items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-700">
            <HugeiconsIcon icon={ChartColumnBigIcon} size={28} color="#6b7280" strokeWidth={1.5} />
        </div>
        <div>
          <h5 class="pb-1 text-xl leading-none text-gray-900 dark:text-white" style="font-weight: 600;">My Growth</h5>
          <p class="text-sm font-normal text-[#7d7d7d] dark:text-gray-400">Leads generated per week</p>
        </div>
      </div>
      <div>
        <span class="inline-flex items-center rounded-lg bg-green-100 px-2.5 py-1 text-xs font-medium text-[#5B8C5A] dark:bg-green-900 dark:text-green-300">
          <ArrowUpOutline class="me-1.5 h-2.5 w-2.5" /> 42.5%
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 pt-3">
      <dl class="flex items-center gap-1">
        <dt class="text-sm font-normal text-[#7d7d7d] dark:text-gray-400">Money spent:</dt>
        <dd class="text-sm font-semibold text-gray-900 dark:text-white">$3,232</dd>
      </dl>
      <dl class="flex items-center gap-1 justify-end">
        <dt class="text-sm font-normal text-[#7d7d7d] dark:text-gray-400">Conversion rate:</dt>
        <dd class="text-sm font-semibold text-gray-900 dark:text-white">1.2%</dd>
      </dl>
    </div>

    <div class="w-full h-[180px] min-w-0 block relative overflow-hidden my-4">
      <Chart options={barOptions} class="py-6" />
    </div>

    <div class="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between pt-5">
        <Button class="inline-flex items-center bg-transparent py-0 text-center text-sm font-medium text-[#7d7d7d] hover:bg-transparent hover:text-gray-900 focus:ring-transparent dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:focus:ring-transparent">Last 7 days<ChevronDownOutline class="m-2.5 ms-1.5 w-2.5" /></Button>
        <Dropdown simple class="w-40 pl-5" offset={-6}>
          <DropdownItem>Yesterday</DropdownItem>
          <DropdownItem>Today</DropdownItem>
          <DropdownItem>Last 7 days</DropdownItem>
          <DropdownItem>Last 30 days</DropdownItem>
          <DropdownItem>Last 90 days</DropdownItem>
        </Dropdown>
        <A href="/" class="hover:text-primary-700 dark:hover:text-primary-500 rounded-lg px-3 py-2 text-sm font-semibold uppercase hover:bg-gray-100 hover:no-underline dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          Leads Report <ChevronRightOutline class="ms-1.5 h-2.5 w-2.5" />
        </A>
      </div>
    </div>
  </Card>
{:else if options.type === "donut"}
  <Card class="p-4 md:p-6 h-[47.8vh] bg-base-100 card-sm shadow-xs rounded-lg bg-white">
    <div class="flex w-full items-start justify-between">
      <div class="flex-col items-center">
        <div class="mb-1 flex items-center gap-2">
          <h5 class="me-1 text-xl leading-none font-bold text-gray-900 dark:text-white" style="font-weight: 600;">Website traffic</h5>
          <InfoCircleSolid id="donut1" class="ms-1 h-3.5 w-3.5 cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
          <Popover triggeredBy="#donut1" class="z-10 w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 shadow-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <div class="space-y-2 p-3">
              <h3 class="font-semibold text-gray-900 dark:text-white">Activity growth - Incremental</h3>
              <p>Report helps navigate cumulative growth of community activities. Ideally, the chart should have a growing trend, as stagnating chart signifies a significant decrease of community activity.</p>
              <h3 class="font-semibold text-gray-900 dark:text-white">Calculation</h3>
              <p>For each date bucket, the all-time volume of activities is calculated. This means that activities in period n contain all activities up to period n, plus the activities generated by your community in period.</p>
              <A href="/">Read more <ChevronRightOutline class="ms-1.5 h-2 w-2" /></A>
            </div>
          </Popover>
        </div>
      </div>
    </div>

    <Chart options={donutOptions} class="py-6" />

    <div class="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between pt-5">
        <Button class="inline-flex items-center bg-transparent py-0 text-center text-sm font-medium text-gray-500 hover:bg-transparent hover:text-gray-900 focus:ring-transparent dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:focus:ring-transparent">Last 7 days<ChevronDownOutline class="m-2.5 ms-1.5 w-2.5" /></Button>
        <Dropdown simple class="w-40 pl-5" offset={-6}>
          <DropdownItem>Yesterday</DropdownItem>
          <DropdownItem>Today</DropdownItem>
          <DropdownItem>Last 7 days</DropdownItem>
          <DropdownItem>Last 30 days</DropdownItem>
          <DropdownItem>Last 90 days</DropdownItem>
        </Dropdown>
        <A href="/" class="hover:text-primary-700 dark:hover:text-primary-500 rounded-lg px-3 py-2 text-sm font-semibold uppercase hover:bg-gray-100 hover:no-underline dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          Traffic analysis
          <ChevronRightOutline class="ms-1.5 h-2.5 w-2.5" />
        </A>
      </div>
    </div>
  </Card>
{/if}