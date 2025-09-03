import { User, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "root/src/config/env";
import catchAsync from "root/src/utils/catchAsync";
import { AppError } from "root/src/utils/error";
import codes from "root/src/utils/statusCode";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      admin: Admin;
    }
  }
}

export const protectRoute = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string;

    if (config.nodeEnv === "development") {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer")) {
        throw new AppError(codes.unAuthorized, "You are not logged in!");
      }
      token = authHeader.split(" ")[1];
    } else {
      token = req.cookies.jwt;
      if (!token) {
        throw new AppError(codes.unAuthorized, "You are not logged in!");
      }
    }

    const { id } = jwt.verify(token, config.jwtSecret) as { id: string };

    const admin = await prisma.admin.findUniqueOrThrow({
      where: { id },
    });

    req.admin = admin;

    next();
  }
);
