import { time } from "$lib/server/utils/general/time";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

// RUN: bun run time.test.ts

console.log("[NOW]: ", new Date(time.now()))
console.log("[IN DAYS]: ", differenceInDays(time.inDays(70), time.inDays(20)).toString(), "days")
console.log("[IN HOURS]: ", differenceInHours(time.inHours(100), time.inHours(45)).toString(), "hours")
console.log("[IN MINUTES: ", differenceInMinutes(time.inMinutes(500), time.inMinutes(123)).toString(), "minutes")