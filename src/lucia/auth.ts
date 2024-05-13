import { Lucia,TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter  } from "@lucia-auth/adapter-drizzle";
import { db } from "../server";
import { sessionSchema } from "../db/session";
import { userSchema } from "../db/user";

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
	}
}

export const lucia = new Lucia(adapter, {
	sessionCookie: {
        name: "session",
		attributes: {
			secure: process.env.NODE_ENV === "PROD", // set `Secure` flag in HTTPS
            sameSite: "strict",

		}
	},
	getUserAttributes: (attributes) => {
		return {
			// we don't need to expose the password hash!
			email: attributes.email,
			emailVerified: attributes.email_verified,
		};
	},
    sessionExpiresIn:new TimeSpan(2, "d")
});

