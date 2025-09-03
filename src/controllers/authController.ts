import { Request, Response } from "express";
import {
  TGetAllUsersType,
  TResetPasswordType,
  TForgotPasswordType,
  TCreateUserType,
  TUpdateUserType,
  TUserLoginType,
  TGetUserByIdType,
  TUserUpdatePasswordType,
} from "root/src/validation/authValidator";
import prisma from "root/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import catchAsync from "root/src/utils/catchAsync";
import { AppError } from "root/src/utils/error";
import jwt from "jsonwebtoken";
import codes from "root/src/utils/statusCode";
import config from "root/src/config/env";
import {
  generatePaginationQuery,
  generatePaginationMeta,
} from "root/src/utils/query";
import { getFrontendUrl } from "root/src/utils/function";
import { comparePassword } from "root/src/utils/function";
import { generateResetToken } from "root/src/utils/token";
import crypto from "crypto";

const generateUserToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
    },
    config.jwtSecret,
    {
      expiresIn: "1d",
    }
  );
};

const createSendToken = (
  user: User,
  status: "success",
  statuscode: number,
  res: Response,
  message: string
) => {
  const token = generateUserToken(user);

  const cookieExpires = Number(config.jwtCookieExpires) || 1;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none" as const,
    secure: true,
  };

  if (config.nodeEnv === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statuscode).json({
    status,
    message,
    token,
    data: user,
  });
};

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password: unhashedPassword,
  } = req.body as unknown as TCreateUserType;

  const password = await bcrypt.hash(unhashedPassword, 12);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      permissions,
      isEnabled: true,
    },
  });

  await EmailService.sendWelcomeUserEmail({
    firstName,
    email,
    password: unhashedPassword,
  });

  res.status(codes.created).json({
    status: "success",
    message: "User Account Successfully Created",
    data: { id: user.id, email: user.email },
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber } =
    req.body as unknown as TUpdateUserType;

  const user = await prisma.user.update({
    where: { id },
    data: { firstName, lastName, phoneNumber },
  });

  res.status(codes.success).json({
    status: "success",
    message: "User updated successfully",
    user: user,
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as unknown as TUserLoginType;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new AppError(codes.badRequest, "User does not exist");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError(codes.unAuthorized, "Incorrect Password");
  }

  createSendToken(
    user,
    "success",
    codes.success,
    res,
    `Login Successful, Welcome, ${user.firstName}`
  );
});

export const userForgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body as TForgotPasswordType;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(codes.notFound, "User Username/Email not found");
    }

    const { resetToken, hashedToken, tokenExpiration } =
      await generateResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: tokenExpiration,
      },
    });

    const passwordResetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await EmailService.sendUserResetPassword({
      email: user.email,
      firstName: user.firstName!,
      passwordResetUrl,
    });

    res.status(codes.success).json({
      status: "success",
      message: `Password reset instructions sent to ${user.email}`,
    });
  }
);

export const userResetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { password } = req.body as unknown as TResetPasswordType;

    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) throw new AppError(codes.badRequest, "Invalid or Expired Token");

    const newPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: `Password reset for User: ${user.email} successful. Kindly log in.`,
    });
  }
);

export const userUpdatePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } =
      req.body as unknown as TUserUpdatePasswordType;
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(codes.notFound, "User not found");
    }

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect)
      throw new AppError(codes.badRequest, "Password is incorrect, try again");

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id },
      data: {
        password: newPasswordHash,
      },
    });

    res.status(codes.success).json({
      status: "success",
      message: `Password updated for User: ${user.email} successfully`,
      data: {
        id: user.id,
        email: user.email,
      },
    });
  }
);

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, perPage } = req.query as unknown as TGetAllUsersType;

  const totalUsers = await prisma.user.count();

  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      isEnabled: true,
      role: { select: { id: true } },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
    ...generatePaginationQuery({ page, perPage }),
  });

  const pagination = generatePaginationMeta({
    page,
    perPage,
    count: totalUsers,
  });

  res.status(codes.success).json({
    status: "success",
    message: "Users retrieved successfully",
    data: {
      pagination,
      users,
    },
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as TGetUserByIdType;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      isEnabled: true,
      role: { select: { id: true } },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(codes.notFound, "User not found");
  }

  res.status(codes.success).json({
    status: "success",
    message: "User details retrieved successfully",
    user,
  });
});

export const suspendUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(codes.notFound, "User not found.");

    await prisma.user.update({
      where: { id },
      data: { isEnabled: false },
    });

    res.status(codes.success).json({
      message: "User Account Suspended.",
    });
  }
);

export const userLogout = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
  };

  res.clearCookie("jwt", cookieOptions);

  res.status(codes.success).json({
    status: "success",
    message: "logged out successfully",
  });
});
