import { integer, serial, text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userSchema } from "./user";


export const sessionSchema = pgTable('sessions',{
    id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userSchema.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
})

export const sessionRelations = relations(sessionSchema,({one})=>({
    user:one(userSchema,{fields:[sessionSchema.id],references:[userSchema.id]})
}))