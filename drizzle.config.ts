import 'dotenv/config';
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
 schema: [`./src/db/users.ts`],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  verbose: true,
  strict: true,
})