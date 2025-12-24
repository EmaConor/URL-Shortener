import { relations, sql } from 'drizzle-orm'
import {
    pgTable,
    uuid,
    timestamp,
    index,
    text,
    varchar,
    unique
} from 'drizzle-orm/pg-core'

import shortUrl from './shortUrl'

const urlProtection = pgTable('url_protection', {
    urlId: uuid('url_id').primaryKey().references(() => shortUrl.id, { onDelete: 'cascade' }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export default urlProtection