import { Request, Response } from "express";
import prisma from "root/prisma";
import { TransactionType, User } from "@prisma/client";
import catchAsync from "root/src/utils/catchAsync";
import { AppError } from "root/src/utils/error";
import codes from "root/src/utils/statusCode";
import {
  generatePaginationQuery,
  generatePaginationMeta,
} from "root/src/utils/query";
import {
  TCreateTransactionType,
  TGetAllTransactionsType,
  TGetTransactionByIdType,
} from "../validation/transactionValidator";
import { Prisma } from "@prisma/client";

// * Transaction fields: id, userId, type (expense/income), categoryId, amount, description, date, recurring (true/false)

// 3. Recurring Transactions

// POST   /api/recurring-transactions     -> Create recurring transaction
// GET    /api/recurring-transactions     -> List recurring transactions
// PATCH  /api/recurring-transactions/:id -> Update recurring transaction
// DELETE /api/recurring-transactions/:id -> Delete recurring transaction

// 4. Categories & Budgets



// POST   /api/budgets            -> Set budget for category
// GET    /api/budgets            -> List all budgets (with progress)
// GET    /api/budgets/:id        -> Get single budget
// PATCH  /api/budgets/:id        -> Update budget
// DELETE /api/budgets/:id        -> Delete budget

export const createTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { type, categoryId, amount, description, date } =
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

export const getAllTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const { page, perPage, category, type, dateFrom, dateTo } =
      req.query as unknown as TGetAllTransactionsType;

    const where: Prisma.TransactionWhereInput = {
      userId: req.user.id,
      isDeleted: false,
      ...(category && { categoryId: category }),
      ...(type && { type: type as TransactionType }),
      ...(dateFrom &&
        dateTo && {
          date: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          },
        }),
    };

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        date: true,
        recurring: true,
      },
      orderBy: { date: "desc" },
      ...generatePaginationQuery({ page, perPage }),
    });

    const totalTransactions = await prisma.transaction.count({ where });

    const pagination = generatePaginationMeta({
      page,
      perPage,
      count: totalTransactions,
    });

    res.status(codes.success).json({
      status: "success",
      message: "Transactions retrieved successfully",
      data: {
        pagination,
        transactions,
      },
    });
  }
);

export const getTransactionById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TGetTransactionByIdType;

    const transaction = await prisma.transaction.findUnique({
      where: { id, userId: req.user.id },
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        date: true,
        recurring: true,
      },
    });

    if (!transaction) {
      throw new AppError(codes.notFound, "Transaction not found");
    }

    res.status(codes.success).json({
      status: "success",
      message: "Transaction retrieved successfully",
      data: { transaction },
    });
  }
);

export const updateTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TGetTransactionByIdType;
    const { type, categoryId, amount, description, date } =
      req.body as unknown as TCreateTransactionType;
    const userId = req.user.id;

    const transaction = await prisma.transaction.findUnique({
      where: { id, userId },
    });

    if (!transaction) {
      throw new AppError(codes.notFound, "Transaction not found");
    }
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
      });

      if (!category) {
        throw new AppError(codes.notFound, "Category not found");
      }
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id, userId },
      data: {
        type,
        categoryId,
        amount,
        description,
        date: new Date(date),
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: "Transaction updated successfully",
      data: { updatedTransaction },
    });
  }
);

export const deleteTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TGetTransactionByIdType;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!transaction) {
      throw new AppError(codes.notFound, "Transaction not found");
    }

    const deletedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: "Transaction deleted successfully",
      data: { deletedTransaction },
    });
  }
);

