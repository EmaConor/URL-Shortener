import { relations } from 'drizzle-orm'
import { 
    pgTable,
    uuid, 
    index, 
    varchar,
    text,
    unique
} from 'drizzle-orm/pg-core'

import plan from './plan'

const feature = pgTable('feature', {
    id: uuid('id').defaultRandom().primaryKey(),
    planId: uuid('plan_id').notNull().references(() => plan.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
},(table) => {
    return {
        unq: unique("unq_feature_plan_name").on(table.planId, table.name),
        planIdIdx: index('idx_features_plan_id').on(table.planId),
    }
})

export default feature