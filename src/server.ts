import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import express,{json} from "express";
import "dotenv/config";
import * as userSchema from "./db/user";
import * as sessionSchema from "./db/session";
const port = process.env.PORT ?? 4940;
import type { User, Session } from "lucia";
import { userRoutes } from "./routes/userRoutes";

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}

const app = express();

app.use(json())
const client = new Client({
  connectionString: process.env.DB_URL,
});

app.use('/',userRoutes)

const connectClient = async () => {
    await client.connect()
}
connectClient()

export const db = drizzle(client, {
  schema: { ...userSchema, ...sessionSchema },
  logger: true,
});

app.listen(port, () => {
  console.log(`Listning on http://localhost:${port}/`);
});
