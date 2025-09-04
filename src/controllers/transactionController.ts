import { Request, Response } from "express";
import prisma from "root/prisma";
import { User } from "@prisma/client";
import catchAsync from "root/src/utils/catchAsync";
import { AppError } from "root/src/utils/error";
import codes from "root/src/utils/statusCode";
import config from "root/src/config/env";
import {
  generatePaginationQuery,
  generatePaginationMeta,
} from "root/src/utils/query";
import crypto from "crypto";
import { TCreateTransactionType } from "../validation/transactionValidator";

// 2. Expense & Income Logging

// GET    /api/transactions         -> List all transactions (filters: date, category, type)
// GET    /api/transactions/:id     -> Get a specific transaction
// PATCH  /api/transactions/:id     -> Update a transaction
// DELETE /api/transactions/:id     -> Delete a transaction
// * Transaction fields: id, userId, type (expense/income), categoryId, amount, description, date, recurring (true/false)

// 3. Recurring Transactions

// POST   /api/recurring-transactions     -> Create recurring transaction
// GET    /api/recurring-transactions     -> List recurring transactions
// PATCH  /api/recurring-transactions/:id -> Update recurring transaction
// DELETE /api/recurring-transactions/:id -> Delete recurring transaction

// 4. Categories & Budgets

// POST   /api/categories         -> Create category
// GET    /api/categories         -> List categories
// PATCH  /api/categories/:id     -> Update category
// DELETE /api/categories/:id     -> Delete category

// POST   /api/budgets            -> Set budget for category
// GET    /api/budgets            -> List all budgets (with progress)
// GET    /api/budgets/:id        -> Get single budget
// PATCH  /api/budgets/:id        -> Update budget
// DELETE /api/budgets/:id        -> Delete budget

export const createTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { type, categoryId, amount, description, date,  } =
      req.body as unknown as TCreateTransactionType;
    const userId = req.user.id;

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new AppError(codes.notFound, "Category not found");
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        categoryId,
        amount,
        description,
        date: new Date(date),

      },
    });

    res.status(codes.created).json({
      status: "success",
      message: "Transaction created successfully",
      data: { transaction },
    });
  }
);
