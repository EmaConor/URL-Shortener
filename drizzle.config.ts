import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema.ts',
    out: './drizzle',
    dbCredentials: {
        url: import.meta.env.DATABASE_URL!,
        ssl: true,
    },
    verbose: true,
    strict: true,
});