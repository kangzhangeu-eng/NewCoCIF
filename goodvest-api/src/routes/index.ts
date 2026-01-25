import { Router } from "express";
import { authRouter } from "./auth.js";
import { subscriptionRouter } from "./subscription.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/subscriptions", subscriptionRouter);
