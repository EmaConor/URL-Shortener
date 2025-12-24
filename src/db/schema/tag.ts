import { relations, sql } from 'drizzle-orm'
import {
    pgTable,
    uuid,
    timestamp,
    text,
    varchar,
    uniqueIndex
} from 'drizzle-orm/pg-core'

import user from './user'
import urlTag from './urlTag'

const tag = pgTable('tag', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id).notNull(),
    name: varchar('name').notNull().unique(),
    color: text('color'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
    return {
        uxTagsUserName: uniqueIndex("ux_tags_user_name").on(table.userId, sql`lower(${table.name})`),
    }
})

export default tag