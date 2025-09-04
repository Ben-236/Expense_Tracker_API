import { Router } from "express";
import { protectRoute } from "root/src/middlewares/authMiddleware";
import validateRequestParameters from "root/src/validation";
import { createTransactionValidator, getAllTransactionsValidator, getTransactionByIdValidator, updateTransactionValidator } from "root/src/validation/transactionValidator";
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction } from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.post(
  "/create",
  validateRequestParameters(createTransactionValidator, "body"),
  createTransaction
);

transactionRouter.get("/all-transaction", protectRoute, validateRequestParameters(getAllTransactionsValidator, "query"), getAllTransactions);

transactionRouter.get("transaction/:id", protectRoute, validateRequestParameters(getTransactionByIdValidator, "params"), getTransactionById);

transactionRouter.patch("update-transaction/:id", protectRoute, validateRequestParameters(updateTransactionValidator, "body"), updateTransaction);

transactionRouter.delete("delete-transaction/:id", protectRoute, deleteTransaction);

export default transactionRouter;
