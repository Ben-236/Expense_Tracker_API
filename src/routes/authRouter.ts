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
import {
  forgotPasswordValidator,
  userLoginValidator,
  userUpdatePasswordValidator,
  createUserValidator,
  resetPasswordValidator,
  getAllUsersValidator,
} from "root/src/validation/authValidator";

const authRouter = Router();

authRouter.post(
  "/create",
  validateRequestParameters(createUserValidator, "body"),
  createUser
);

authRouter.post(
  "/login",
  validateRequestParameters(userLoginValidator, "body"),
  loginUser
);

authRouter.post(
  "/forgot-password",
  validateRequestParameters(forgotPasswordValidator, "body"),
  userForgotPassword
);

authRouter.patch(
  "/reset-password/:token",
  validateRequestParameters(resetPasswordValidator, "body"),
  userResetPassword
);

authRouter.patch(
  "/update-password/:id",
  protectRoute,
  validateRequestParameters(userUpdatePasswordValidator, "body"),
  userUpdatePassword
);

authRouter.patch("/update/:id", protectRoute, updateUser);

authRouter.post("/suspend/:id", protectRoute, suspendUser);

authRouter.get("/get-all-users", protectRoute, getAllUsers);

authRouter.get(
  "/get-user/:id",
  protectRoute,
  validateRequestParameters(getAllUsersValidator, "params"),
  getUserById
);

authRouter.post("/logout", protectRoute, userLogout);

export default authRouter;
