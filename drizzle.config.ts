import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/lib/server/data/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_SUPABASE_URL || ''
    }
})