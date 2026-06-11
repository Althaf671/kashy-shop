<script lang="ts">
  import { Card, A, Button, Dropdown, DropdownItem } from "flowbite-svelte";
  import { ArrowUpOutline, ChevronDownOutline, ChevronRightOutline } from "flowbite-svelte-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { ChartColumnBigIcon } from "@hugeicons/core-free-icons";
  import type ApexCharts from "apexcharts";

  let chartElement: HTMLDivElement = $state();
  let chartInstance: ApexCharts | null = null

  const options = {
    colors: ["#1A56DB", "#FDBA8C"],
    series: [
      {
        name: "Organic",
        color: "#1A56DB",
        data: [
          { x: "Mon", y: 231 }, { x: "Tue", y: 122 }, { x: "Wed", y: 63 },
          { x: "Thu", y: 421 }, { x: "Fri", y: 122 }, { x: "Sat", y: 323 }, { x: "Sun", y: 111 }
        ]
      },
      {
        name: "Social media",
        color: "#FDBA8C",
        data: [
          { x: "Mon", y: 232 }, { x: "Tue", y: 113 }, { x: "Wed", y: 341 },
          { x: "Thu", y: 224 }, { x: "Fri", y: 522 }, { x: "Sat", y: 411 }, { x: "Sun", y: 243 }
        ]
      }
    ],
    chart: {
      type: "bar",
      height: "100%",
      width: "100%", 
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      redrawOnParentResize: true, 
      redrawOnWindowResize: true,
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "60%", borderRadiusApplication: "end", borderRadius: 8 }
    },
    grid: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    yaxis: { show: false },
    fill: { opacity: 1 }
  };

  $effect(() => {
    if (chartElement && !chartInstance) {
      import("apexcharts").then(({ default: ApexCharts }) => {
        chartInstance = new ApexCharts(chartElement, options);
        chartInstance?.render()

        window.addEventListener('resize', () => {
          if (chartInstance) chartInstance.updateOptions({});
        });
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    };
  });
</script>

<Card class="p-4 md:p-6 bg-base-100 shadow-sm rounded-none w-full overflow-hidden min-w-0"> 
  <div class="mb-4 flex justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
    <div class="flex items-center gap-3">
      <div class="me-3 flex h-12 w-12 p-3 items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-700">
          <HugeiconsIcon icon={ChartColumnBigIcon} size={28} color="#6b7280" strokeWidth={1.5} />
      </div>
      <div>
        <h5 class="pb-1 text-2xl leading-none font-bold text-gray-900 dark:text-white">3.4k</h5>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Leads generated per week</p>
      </div>
    </div>
    <div>
      <span class="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
        <ArrowUpOutline class="me-1.5 h-2.5 w-2.5" /> 42.5%
      </span>
    </div>
  </div>

  <div class="grid grid-cols-2 pt-3">
    <dl class="flex items-center gap-1">
      <dt class="text-sm font-normal text-gray-500 dark:text-gray-400">Money spent:</dt>
      <dd class="text-sm font-semibold text-gray-900 dark:text-white">$3,232</dd>
    </dl>
    <dl class="flex items-center gap-1 justify-end">
      <dt class="text-sm font-normal text-gray-500 dark:text-gray-400">Conversion rate:</dt>
      <dd class="text-sm font-semibold text-gray-900 dark:text-white">1.2%</dd>
    </dl>
  </div>

  <div class="w-full h-[220px] min-w-0 block relative overflow-hidden my-4">
    <div bind:this={chartElement} class="w-full h-full"></div>
  </div>

  <div class="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between pt-5">
      <Button class="inline-flex items-center bg-transparent py-0 text-center text-sm font-medium text-gray-500 hover:bg-transparent hover:text-gray-900 focus:ring-transparent dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:focus:ring-transparent">Last 7 days<ChevronDownOutline class="m-2.5 ms-1.5 w-2.5" /></Button>
      <Dropdown simple class="w-40" offset={-6}>
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