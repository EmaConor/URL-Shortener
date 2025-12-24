import { relations, sql } from 'drizzle-orm'
import { pgTable, uuid, timestamp, index, text, varchar, boolean } from 'drizzle-orm/pg-core'

import user from './user'

const shortUrl = pgTable(
  'short_url',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    fullUrl: text('full_url').notNull(),
    code: varchar('code', { length: 10 }).notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    isDirect: boolean('is_direct').notNull().default(false),
    isProtected: boolean('is_protected').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    desactiveAt: timestamp('desactive_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 day'`),
  },
  (table) => {
    return {
      userIdIdx: index('idx_short_url_user_id').on(table.userId),
      codeIdx: index('idx_short_url_code').on(table.code),
    }
  }
)

export default shortUrl
