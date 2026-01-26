import { Request, Response } from "express";
import prisma from "root/prisma";
import catchAsync from "root/src/utils/catchAsync";
import { AppError } from "root/src/utils/error";
import codes from "root/src/utils/statusCode";
import {
  generatePaginationQuery,
  generatePaginationMeta,
} from "root/src/utils/query";
import { Prisma } from "@prisma/client";
//import { TCreateCategoryType, TGetAllCategoriesType, TGetCategoryByIdType, TUpdateCategoryType } from "../validation/categoryValidator";


export const createBudget = catchAsync(
  async (req: Request, res: Response) => {
    const { amount, categoryId, spent, startDate, endDate } =
      req.body as unknown as TCreateBudgetType;
    const userId = req.user.id;

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new AppError(codes.notFound, "Category not found");
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        categoryId,
        amount,
        spent,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    res.status(codes.created).json({
      status: "success",
      message: "Budget created successfully",
      data: { budget },
    });
  }
);

export const getAllBudgets = catchAsync(
  async (req: Request, res: Response) => {
    const { page, perPage, category, startDate, endDate } = req.query as unknown as TGetAllBudgetsType;

    const where: Prisma.BudgetWhereInput = {
      userId: req.user.id,
      isDeleted: false,
      ...(category && { categoryId: category }),
      ...(startDate &&
        endDate && {
          startDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const budgets = await prisma.budget.findMany({
      where,
      select: {
        id: true,
        amount: true,
        spent: true,
        startDate: true,
        endDate: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      ...generatePaginationQuery({ page, perPage }),
    });

    const totalBudgets = await prisma.budget.count({ where });

    const pagination = generatePaginationMeta({
      page,
      perPage,
      count: totalBudgets,
    });

    res.status(codes.success).json({
      status: "sucess",
      message: "Budget retrieved succesfully",
      data: {
        pagination,
        budgets,
      }
    });
  }
);

export const getBudgetById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TGetBudgetByIdType;

    const budget = await prisma.budget.findFirst({
      where: { id, userId: req.user.id },
      select: {
        id: true,
        amount: true,
        spent: true,
        startDate: true,
        endDate: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!budget) {
      throw new AppError(codes.notFound, "Budget not found");
    }

    res.status(codes.success).json({
      status: "success",
      message: "Budget retrieved successfully",
      data: { budget },
    });
  }
);

export const updateBudget = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TUpdateBudgetType;
    const { amount, spent, startDate, endDate } =
      req.body as unknown as TUpdateBudgetType; 
      const userId = req.user.id;

      const budget = await prisma.budget.findUnique({
        where: { id, userId },
      });

      if (!budget) {
        throw new AppError(codes.notFound, "Budget not found");
      }

    const updatedBudget = await prisma.budget.update({
      where: { id, userId },
      data: {
        amount,
        spent,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: "Budget updated successfully",
      data: { updatedBudget },
    });
  }
);

export const deleteBudget = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TGetBudgetByIdType;

    const budget = await prisma.budget.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!budget) {
      throw new AppError(codes.notFound, "Budget not found");
    }

    const deletedBudget = await prisma.budget.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: "Budget deleted successfully",
      data: { deletedBudget },
    });
  }
);