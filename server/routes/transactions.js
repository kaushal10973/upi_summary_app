import express from "express";
import { CATEGORIES } from "../config/categories.js";
import { transactions } from "../data/transactions.js";
import { parseTransaction } from "../services/transactionParser.js";
import { reduceAnalytics } from "../services/analyticsReducer.js";

export const transactionsRouter = express.Router();

function getParsedTransactions() {
  return transactions
    .map(parseTransaction)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

transactionsRouter.get("/transactions", (_request, response) => {
  response.json({
    data: getParsedTransactions(),
    meta: {
      categories: CATEGORIES
    }
  });
});

transactionsRouter.get("/analytics", (_request, response) => {
  response.json({
    data: reduceAnalytics(getParsedTransactions())
  });
});

transactionsRouter.patch("/transactions/:id", (request, response) => {
  const transaction = transactions.find((item) => item.id === request.params.id);

  if (!transaction) {
    return response.status(404).json({
      error: {
        message: "Transaction not found."
      }
    });
  }

  const { category } = request.body;
  if (!CATEGORIES.includes(category)) {
    return response.status(400).json({
      error: {
        message: "Invalid category.",
        allowedCategories: CATEGORIES
      }
    });
  }

  transaction.manualCategory = category;

  const parsedTransactions = getParsedTransactions();

  return response.json({
    data: {
      transaction: parsedTransactions.find((item) => item.id === transaction.id),
      transactions: parsedTransactions,
      analytics: reduceAnalytics(parsedTransactions)
    }
  });
});
