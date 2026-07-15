import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import de from "dotenv";
import cors from "cors";

import transactionsRoute from "./routes/transactionsRoute";
import rateLimiter from "./middlewares/rateLimiter";
import job from "./config/cron";

const app = express();

de.config();
app.use(rateLimiter);
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

if (process.env.Node_ENV == "production") job.start();

app.use("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Refreshed" });
});

app.use("/api/transactions/", transactionsRoute);

initDB().then(() => {
  app.listen(5001, () => {
    console.log("Server Running At Port 5001");
  });
});
