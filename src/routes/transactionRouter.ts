import { Router } from "express";
import {
  createUser,
  updateUser,
  loginUser,
  userForgotPassword,
  userResetPassword,
  userUpdatePassword,
  getAllUsers,
  getUserById,
  suspendUser,
  userLogout,
} from "root/src/controllers/authController";
import { protectRoute } from "root/src/middlewares/authMiddleware";

import validateRequestParameters from "root/src/validation";
import { createTransactionValidator } from "root/src/validation/transactionValidator";
import { createTransaction } from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.post(
  "/create",
  validateRequestParameters(createTransactionValidator, "body"),
  createTransaction
);

export default transactionRouter;
