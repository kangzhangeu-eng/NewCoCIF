import express, { type Request, type Response } from "express";
import cors from "cors";
import { router } from "./routes/index.js";

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", router);

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
};
