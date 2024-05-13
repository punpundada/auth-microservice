import {createInsertSchema} from 'drizzle-zod'
import { userSchema } from '../db/user'
import { z } from 'zod'


export const userZodSchem = createInsertSchema(userSchema,{
    email:z.string().email(),
    password:z.string().min(6).max(64)
})