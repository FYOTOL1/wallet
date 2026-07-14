import { Request, Response } from "express";
import { sql } from "../config/db";
import { TPostTransaction } from "../types/transactions.type";

async function getTransactionsById(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    return res.status(200).json(transactions);
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createTransaction(req: Request, res: Response) {
  try {
    const { title, amount, category, user_id }: TPostTransaction = req.body;
    if (!title || !category || !user_id || amount === undefined) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const transaction = await sql`
    INSERT INTO transactions(
      user_id,title,amount,category
    ) VALUES (${user_id},${title},${amount},${category})
    RETURNING *
    `;

    console.log(transaction);
    return res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteTransaction(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id as string))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
    DELETE FROM transactions  WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getSummaryById(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    console.log(userId);

    const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as income FROM transactions
        WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
        WHERE user_id = ${userId} AND amount < 0
    `;

    return res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export {
  getTransactionsById,
  createTransaction,
  deleteTransaction,
  getSummaryById,
};
