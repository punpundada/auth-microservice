import { integer, serial, text, pgTable ,boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sessionSchema } from "./session";

export const userSchema = pgTable('users',{
    id:text('id').primaryKey(),
    name:text("name").notNull(),
    email:text('email').notNull().unique(),
    password:text('password_hash').notNull(),
    emailVerified:boolean('email_verified').default(false)
})


export const userRelations = relations(userSchema,({one})=>({
    session:one(sessionSchema,{fields:[userSchema.id],references:[sessionSchema.id]})
}))