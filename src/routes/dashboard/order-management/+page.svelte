<script lang="ts">
	import Card from "$lib/components/ui/card/Card.svelte";
	import { HEADER_KEY, type THeaderData } from "$lib/stores/global/context.js";
	import { Button, ButtonGroup, Heading } from "flowbite-svelte";
	import { CalendarMonthOutline, DownloadSolid } from "flowbite-svelte-icons";
	import { getContext } from "svelte";

    // header props
    const headerData: THeaderData = getContext(HEADER_KEY)
    $effect(() => {
        headerData.pageName = "Order Management";
        headerData.description = "View all of your business summary.";
    });
    
    // metric data
    let { data } = $props()

    // get time of day
    function getTimeOfDay(): string {
        const currentHour = new Date(Date.now()).getHours();

        if (currentHour >= 6 && currentHour < 12) {
            return "Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    }

//   const images1 = [
//     { alt: "erbology", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg" },
//     { alt: "shoes", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg" },
//     { alt: "small bag", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg" }
//   ];
//   const images2 = [
//     { alt: "plants", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg" },
//     { alt: "watch", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg" },
//     { alt: "shoe", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg" }
//   ];
//   const images3 = [
//     { alt: "cream", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg" },
//     { alt: "small bag", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg" },
//     { alt: "lamp", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg" }
//   ];
//   const images4 = [
//     { alt: "toiletbag", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg" },
//     { alt: "playstation", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg" },
//     { alt: "bag", src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg" }
//   ];
</script>

<main class="order__management">

    <!-- filter and export -->
    <div class="flex justify-between items-center">
        <Heading tag="h2" class="text-2xl font-[600]">Good {getTimeOfDay()}, Kashley</Heading>

        <ButtonGroup class="rounded-none shadow-none gap-3 justify-end">
            <Button class="px-3 flex gap-1 rounded-md hover:bg-blue cursor-pointer text-[#636363]" >
                <CalendarMonthOutline class="me-2 h-4.5 w-4.5 text-[#7d7d7d]" />
                Date Range
            </Button>
            <Button class="px-3 flex gap-1.5 bg-[#824C71] text-[#f4f3ee] hover:bg-[#824C71] cursor-pointer rounded-md">
                <DownloadSolid class="me-2 h-4.5 w-4.5" />
                Export CSV
            </Button>
        </ButtonGroup>
    </div>

    <!-- metric panel -->
    <div class="metric-panel">
       {#each data.metrics as metric (metric)}
            <Card content={metric} />
       {/each}
    </div>

    <!-- <Gallery class="grid-cols-2 gap-4 md:grid-cols-4">
    <Gallery items={images1} />
    <Gallery items={images2} />
    <Gallery items={images3} />
    <Gallery items={images4} />
    </Gallery> -->

</main>

<style>
    .order__management {
        display: flex;
        flex-direction: column;
        padding-top: 1.5rem;
        gap: 1rem;
        height: auto;
        background-color: #f4f3ee;
    }

    .metric-panel {
        display: flex;
        gap: 1rem;
    }
</style>