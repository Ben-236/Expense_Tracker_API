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
import { TCreateSavingsType, TUpdateSavingsType } from "../validation/savingsValidator";

export const createSavings = catchAsync(async (req: Request, res: Response) => {
  const { name, target, deadline } = req.body as unknown as TCreateSavingsType;

  const userId = req.user.id;

  const savings = await prisma.savingsGoal.create({
    data: {
      name,
      target,
      deadline,
      userId,
    },
  });

  res.status(codes.created).json({
    status: "success",
    message: "Savings goal created successfully",
    data: { savings },
  });
});


// export const updateSavings = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params as unknown as { id: string };
//   const { name, target, deadline } = req.body as unknown as TUpdateSavingsType;
//   const userId = req.user.id;


//   const existingSavings = await prisma.savingsGoal.findFirst({
//   where: {
//     id,
//     userId,
//   },
// });

// if (!existingSavings) {
//   throw new AppError(codes.notFound, "Savings goal not found");
// }


//   const savings = await prisma.savingsGoal.update({
//     where: { id },
//     data: {
//       name,
//       target,
//       deadline,
//     },
//   });

//   res.status(codes.success).json({
//     status: "success",
//     message: "Savings goal updated successfully",
//     data: { savings },
//   });
// });


export const updateSavings = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const { name, target, deadline } =
      req.body as TUpdateSavingsType;

    const userId = req.user.id;

    const existingSavings =
      await prisma.savingsGoal.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!existingSavings) {
      throw new AppError(
        codes.notFound,
        "Savings goal not found"
      );
    }

    const updateData: Prisma.SavingsGoalUpdateInput = {};

    if (name !== undefined && name !== null) {
      updateData.name = name;
    }

    if (target !== undefined && target !== null) {
      updateData.target = target;
    }

    if (deadline !== undefined) {
      updateData.deadline = deadline;
    }

    const savings = await prisma.savingsGoal.update({
      where: { id },
      data: updateData,
    });

    res.status(codes.success).json({
      status: "success",
      message: "Savings goal updated successfully",
      data: { savings },
    });
  }
);

export const getAllSavings = catchAsync( async (req: Request, res: Response) => {
  const { page, perPage } = req.query as unknown as { page: number, perPage: number };

  const savings = await prisma.savingsGoal.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    ...generatePaginationQuery({ page, perPage }),
  });

  const totalSavings = await prisma.savingsGoal.count({ where: { userId: req.user.id } });

  const pagination = generatePaginationMeta({ page, perPage, count: totalSavings });

  res.status(codes.success).json({
    status: "success",
    message: "Savings goals retrieved successfully",
    data: {
      pagination,
      savings,
    },
  });
});

export const getSavingsById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const savings = await prisma.savingsGoal.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      select: {
        id: true,
        name: true,
        target: true,
        saved: true,
        deadline: true,
      },
    });

    if (!savings) {
      throw new AppError(codes.notFound, "Savings goal not found");
    }

    res.status(codes.success).json({
      status: "success",
      message: "Savings goal retrieved successfully",
      data: { savings },
    });
  }
);

export const deleteSavings = catchAsync( async (req: Request, res: Response) => {
  const { id } = req.params as unknown as { id: string };
  

  const savings = await prisma.savingsGoal.findFirst({
  where: {
    id,
    userId: req.user.id,
  },
});

if (!savings) {
  throw new AppError(codes.notFound, "Savings goal not found");
}

await prisma.savingsGoal.delete({
  where: { id },
});


  res.status(codes.success).json({
    status: "success",
    message: "Savings goal deleted successfully",
    data: { id },
  });
});
