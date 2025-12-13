import { pgTable, uuid, varchar, integer, boolean, index, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const short_url = pgTable('short_url', {
    id: uuid('id').defaultRandom().primaryKey(),
    full_url: text('full_url').notNull(),
    short_code: varchar('short_code', { length: 10 }).notNull().unique(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    expires_at: timestamp('expires_at').notNull().default(sql`CURRENT_TIMESTAMP + INTERVAL '1 day'`),
});

// pnpm drizzle-kit push