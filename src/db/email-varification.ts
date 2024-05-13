import {serial, text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const emailVarificationScheam = pgTable('eamil_varification',{
    id:serial('id').primaryKey(),
    code:text('id').notNull(),
    userId:text('user_id').unique(),
    email:text("email"),
    expiresAt:timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
})