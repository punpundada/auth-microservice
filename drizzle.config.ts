import 'dotenv/config';
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
 schema: [`./src/db/user.ts`],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  verbose: true,
  strict: true,
})