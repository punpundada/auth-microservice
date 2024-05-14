import { Lucia,TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter  } from "@lucia-auth/adapter-drizzle";
import { db } from "../server";
import { sessionSchema } from "../db/session";
import { userSchema } from "../db/user";
import 'dotenv/config'

interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
	fresh: boolean;
}

export const adapter = new DrizzlePostgreSQLAdapter (db, sessionSchema, userSchema);

export const hashOptions = {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
}

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			email: string;
			email_verified: boolean;
		};
		DatabaseSessionAttributes: {
			country: string;
		};
	}
}

export const lucia = new Lucia(adapter, {
	sessionCookie: {
        name: "session",
		attributes: {
			secure: process.env.NODE_ENV === "PROD", // set `Secure` flag in HTTPS
            // sameSite: "strict",
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			emailVerified: attributes.email_verified,
		};
	},
	getSessionAttributes:(attr)=>{
		return {
			country: attr.country
		}
	},
    sessionExpiresIn:new TimeSpan(1, "w")
});