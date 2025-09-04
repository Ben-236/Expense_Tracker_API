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
import { TCreateCategoryType, TGetAllCategoriesType, TGetCategoryByIdType, TUpdateCategoryType } from "../validation/categoryValidator";


export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name } = req.body as unknown as TCreateCategoryType;
    const userId = req.user.id;

    const category = await prisma.category.create({
      data: {
        name,
        userId, 
      },
    });

    res.status(codes.created).json({
      status: "success",
      message: "Category created successfully",
      data: { category },
    });
  }
);


export const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const { page, perPage } = req.query as unknown as TGetAllCategoriesType;

    const categories = await prisma.category.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: { name: "asc" },
      ...generatePaginationQuery({ page, perPage }),
    });

    const totalCategories = await prisma.category.count({
      where: {
        userId: req.user.id,
      },
    });

    const pagination = generatePaginationMeta({
      page,
      perPage,
      count: totalCategories,
    });

    res.status(codes.success).json({
      status: "success",
      message: "Categories retrieved successfully",
      data: {
        pagination,
        categories,
      },
    });
  }
);

export const getCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TGetCategoryByIdType;

    const category = await prisma.category.findUnique({
  where: { id: id, userId: req.user.id },
  select: {
    id: true,
    name: true,
    budgets: {
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
    },
  },
});


    if (!category) {
      throw new AppError(codes.notFound, "Category not found");
    }

    res.status(codes.success).json({
      status: "success",
      message: "Category retrieved successfully",
      data: { category },
    });
  }
);

export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body as unknown as TUpdateCategoryType;
    const userId = req.user.id;

    const category = await prisma.category.findUnique({
      where: { id, userId },
    });

    if (!category) {
      throw new AppError(codes.notFound, "Category not found");
    }

    const updatedCategory = await prisma.category.update({
      where: { id, userId },
      data: {
        name,
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: "Category updated successfully",
      data: { updatedCategory },
    });
  }
);

export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TGetCategoryByIdType;

    const category = await prisma.category.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!category) {
      throw new AppError(codes.notFound, "Category not found");
    }

    const deletedCategory = await prisma.category.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: "Category deleted successfully",
      data: { deletedCategory },
    });
  }
);  