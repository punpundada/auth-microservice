import { Request, Response } from "express";
import { UserInsert, UserSelect } from "../types/userTypes";
import { userZodSchem } from "../zodSchemas/userZodSchema";
import { hash, verify } from "@node-rs/argon2";
import { hashOptions, lucia } from "../lucia/auth";
import { generateIdFromEntropySize } from "lucia";
import { db } from "../server";
import { userSchema } from "../db/user";
import { Res } from "../types/Response";
import { ZodError, z } from "zod";
import { emailZodSchema } from "../zodSchemas/utilsZodSchema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationCode } from "../utils";

export const userSignup = async (
  req: Request<unknown, unknown, UserInsert>,
  res: Response<Res<Omit<UserSelect, "password_hash">>>
) => {
  const userId = generateIdFromEntropySize(10);
  try {
    req.body.id = userId;

    const validData = userZodSchem.parse(req.body);

    const passwordHash = await hash(validData.password, hashOptions);

    validData.password = passwordHash;

    const savedUser = await db
      .insert(userSchema)
      .values(validData)
      .returning({ id: userSchema.id, email: userSchema.email, name: userSchema.name });

    const verificationCode = await generateEmailVerificationCode(savedUser[0].id, savedUser[0].email);
    // await sendVerificationCode(email, verificationCode);
    const session = await lucia.createSession(userId, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    res.set("Location", "/");
    res.set("Set-Cookie", sessionCookie.serialize());
    return res
      .status(201)
      .json({
        isSuccess: true,
        message: "User registred successfully",
        result: savedUser as any,
      })
      .header({
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(),
      });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        isSuccess: false,
        issues: error.issues,
        message: error.name,
      });
    }
    if (error instanceof Error) {
      return res.status(401).json({
        isSuccess: false,
        issues: [],
        message: error.message,
      });
    }
    return res.status(401).json({
      isSuccess: false,
      issues: [],
      message: "Something went wrong",
    });
  }
};

export const usetLogin = async (
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response<
    Res<{
      id: string;
      name: string;
      email: string;
    }>
  >
) => {
  try {
    const validEmail = emailZodSchema.parse(req.body.email);
    const parsedPassword = z.string().min(8).max(64).parse(req.body.password);
    const user = await db.query.userSchema.findFirst({
      where: eq(userSchema.email, validEmail),
    });
    if (!user) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid email or password",
        issues: [],
      });
    }

    const validPassword = await verify(user.password, parsedPassword, hashOptions);

    if (!validPassword) {
      return res.status(200).json({
        isSuccess: true,
        message: "Login successfully",
        result: user,
      });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.set("Location", "/");
    res.set("Set-Cookie", sessionCookie.serialize());
    return res.status(200).json({
      isSuccess: true,
      message: "Login successfully",
      result: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        isSuccess: false,
        issues: error.issues,
        message: error.name,
      });
    }
    if (error instanceof Error) {
      return res.status(401).json({
        isSuccess: false,
        issues: [],
        message: error.message,
      });
    }
    return res.status(401).json({
      isSuccess: false,
      issues: [],
      message: "Something went wrong",
    });
  }
};
