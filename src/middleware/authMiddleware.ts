import { verifyRequestOrigin } from "lucia";
import { lucia } from "../lucia/auth";
// import type { User, Session } from "lucia";
import { NextFunction, Request, Response } from "express";

export const protectionCSRF = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    return next();
  }
  const originHeader = req.headers.origin ?? null;
  const hostHeader = req.headers.host ?? null;

  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return res.status(403).end();
  }
};

export const readValidateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");

  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  res.locals.user = user;
  res.locals.session = session;
  return next();
};

// declare global {
//     namespace Express {
//       interface Locals {
//         user: User | null;
//         session: Session | null;
//       }
//     }
//   }
