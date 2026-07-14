import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryById,
  getTransactionsById,
} from "../controllers/transactionsController";

const router = express.Router();

router.get("/:userId", getTransactionsById);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryById);

export default router;
