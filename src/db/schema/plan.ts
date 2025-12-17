import { relations, sql } from 'drizzle-orm'
import { 
    pgTable,
    uuid,  
    decimal, 
    text,
    varchar, 
} from 'drizzle-orm/pg-core'

import user from './user'
import feature from './feature'

const plan = pgTable('plan', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    price: decimal('price', {precision: 12, scale: 2}).notNull(),
    description: text('description'),
})

export default plan