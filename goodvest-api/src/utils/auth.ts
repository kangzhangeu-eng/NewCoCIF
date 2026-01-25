import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";

export type AuthPayload = {
  userId: string;
  subscriptionId: string;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

export const signAuthToken = (payload: AuthPayload) =>
  jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });

export const verifyAuthToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(token, getJwtSecret());
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }
  const payload = decoded as jwt.JwtPayload & AuthPayload;
  if (!payload.userId || !payload.subscriptionId) {
    throw new Error("Invalid token payload");
  }
  return { userId: payload.userId, subscriptionId: payload.subscriptionId };
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  const match = authHeader.match(/^Bearer (.+)$/);
  const token = match?.[1];
  if (!token) {
    res.status(401).json({ message: "Invalid Authorization header" });
    return;
  }

  try {
    req.auth = verifyAuthToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
