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
import tag from './tag'

const urlTag = pgTable('url_tag', {
    id: uuid('id').defaultRandom().primaryKey(),
    urlId: uuid('url_id').references(() => shortUrl.id, { onDelete: 'cascade' }).notNull(),
    tagId: uuid('tag_id').references(() => tag.id, { onDelete: 'cascade' }).notNull(),
}, (table) => {
    return {
        unq: unique('unq_url_tag_pair').on(table.urlId, table.tagId),
        urlIdIdx: index('idx_url_tag_url_id').on(table.urlId),
        tagIdIdx: index('idx_url_tag_tag_id').on(table.tagId),
    }
})

export default urlTag