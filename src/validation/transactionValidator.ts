import * as Yup from "yup";
import { paginationValidation } from ".";
import { TransactionType } from "@prisma/client";

export const createTransactionValidator = Yup.object().shape({
  type: Yup.string().
  oneOf(Object.values(TransactionType)).required("Transaction type is required"),
  categoryId: Yup.string().required("Category id is required"),
  amount: Yup.number().required("Amount is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
  //recurring: Yup.boolean().required("Recurring is required"),
});



export type TCreateTransactionType = Yup.InferType<
  typeof createTransactionValidator>;