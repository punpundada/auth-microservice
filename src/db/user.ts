import { integer, serial, text, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sessionSchema } from "./session";

export const userSchema = pgTable('users',{
    id:text('id').primaryKey(),
    name:text("name").notNull(),
    email:text('email').notNull().unique(),
    password:text('password_hash').notNull()
})


export const userRelations = relations(userSchema,({one})=>({
    session:one(sessionSchema,{fields:[userSchema.id],references:[sessionSchema.id]})
}))