import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import * as relations from "./schema.relations";
import postgres from "postgres";
import { ENV } from "../config/general/env";

const client = postgres(ENV.DATABASE_URL);

export const db = drizzle(client, {
    schema: {
        ...schema,
        ...relations
    }
})