import { userSchema } from "../db/user";

export type UserSelect = typeof userSchema.$inferSelect
export type UserInsert = typeof userSchema.$inferInsert