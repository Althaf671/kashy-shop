// import { onDestroy } from "svelte";

// export function clock(): { currentTime: string, currentDate: string } {
//     let currentTime = $state("");
//     let currentDate = $state("");

//     function updateClock() {
//         const now = new Date();
        
//         currentTime = now.toLocaleTimeString('en-US', { 
//             hour12: true, 
//             hour: '2-digit', 
//             minute: '2-digit'
//         }).replace(/:/g, '.'); 

//         currentDate = now.toLocaleDateString('en-US', { 
//             day: 'numeric', 
//             month: 'short', 
//             year: 'numeric' 
//         });
//     }

//     updateClock();
//     const interval = setInterval(updateClock, 1000);

//     onDestroy(() => {
//         clearInterval(interval);
//     });

//     return
// }