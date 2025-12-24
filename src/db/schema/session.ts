import { pgTable, 
    text, 
    timestamp, 
    uuid 
} from "drizzle-orm/pg-core"

import user from "./user"

const session = pgTable("session", {
	id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id),
	token: text("token").notNull().unique(),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
})

export default session