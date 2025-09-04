import express from "express";
import authRouter from "./authRouter";
import transactionRouter from "./transactionRouter";


const userRouter = express.Router();

authRouter.use("/auth", authRouter);
transactionRouter.use("/transactions", transactionRouter);

export default userRouter;
