import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { loginSchema } from "../schemas/auth.js";
import { prisma } from "../utils/prisma.js";
import { requireAuth, signAuthToken } from "../utils/auth.js";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: { subscription: true },
  });

  if (!user || !user.passwordHash) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  if (!user.subscription) {
    res.status(400).json({ message: "Subscription not initialized" });
    return;
  }

  const token = signAuthToken({ userId: user.id, subscriptionId: user.subscription.id });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      birthDate: user.birthDate,
      subscriptionId: user.subscription.id,
    },
  });
});

authRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  const auth = req.auth;
  if (!auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { subscription: true },
  });

  if (!user || !user.subscription) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      birthDate: user.birthDate,
      subscriptionId: user.subscription.id,
    },
  });
});
