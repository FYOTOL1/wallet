import express from "express";
import { initDB } from "./config/db";
import de from "dotenv";

import transactionsRoute from "./routes/transactionsRoute";
import rateLimiter from "./middlewares/rateLimiter";

const app = express();

app.use(rateLimiter);
app.use(express.json());
de.config();

app.use("/api/transactions/", transactionsRoute);

initDB().then(() => {
  app.listen(5001, () => {
    console.log("Server Running At Port 5001");
  });
});
