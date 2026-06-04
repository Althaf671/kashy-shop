import { time } from "../utils/general/time";

export const rateLimitConstraint = {
    authRequestLimit: {
        minutes: time.inMinutes(1),
        attempts: 15
    },
    dashboardRequestLimit: {
        minutes: time.inMinutes(1),
        attemps: 50
    }
} as const