import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema/index.ts',
    out: './src/db/migrations',
    dbCredentials: {
        // url: import.meta.env.DATABASE_URL!,
        url: process.env.DATABASE_URL!,
        ssl: true,
    },
    verbose: true,
    strict: true,
});