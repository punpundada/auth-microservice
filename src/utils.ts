import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { db } from "./server";
import { emailVarificationScheam } from "./db/email-varification";
import { eq } from "drizzle-orm";
import { userSchema } from "./db/user";

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
	await db.delete(emailVarificationScheam).where(eq(userSchema.id,userId))

	const code = generateRandomString(8, alphabet("0-9"));
    
    await db.insert(emailVarificationScheam).values({
        userId:userId,
        code,
        expiresAt:createDate(new TimeSpan(15, "m")), // 15 minutes
        email
    })
	return code;
}