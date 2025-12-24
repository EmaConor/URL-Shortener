import { relations, sql } from 'drizzle-orm'
import {
    pgTable,
    uuid,
    varchar,
    boolean,
    index,
    timestamp,
    text
} from 'drizzle-orm/pg-core'

import plan from './plan'

const user = pgTable('user', {
    id: text("id").primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    planId: uuid('plan_id').references(() => plan.id).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    isActive: boolean('is_active').notNull().default(true),
    image: text("image"),
}, (table) => {
    return {
        emailIdx: index('idx_user_email').on(table.email),
        planIdIdx: index('idx_user_plan_id').on(table.planId),
    }
})

export default user
