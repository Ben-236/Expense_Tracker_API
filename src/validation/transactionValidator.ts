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

export const updateTransactionValidator = Yup.object().shape({
  type: Yup.string().
  oneOf(Object.values(TransactionType)).optional(),
  categoryId: Yup.string().optional(),
  amount: Yup.number().optional(),
  description: Yup.string().optional(),
  date: Yup.date().optional(),
});

export const getAllTransactionsValidator = Yup.object().shape({
category: Yup.string().optional(),
  type: Yup.string().optional(),
  dateFrom: Yup.date().optional(),
  dateTo: Yup.date().optional(),}).concat(paginationValidation);
  


export const getTransactionByIdValidator = Yup.object().shape({
  id: Yup.string().uuid().required("ID is required").uuid("Invalid ID format"),
});

export type TGetAllTransactionsType = Yup.InferType<
  typeof getAllTransactionsValidator
>;
export type TGetTransactionByIdType = Yup.InferType< typeof getTransactionByIdValidator>;
export type TCreateTransactionType = Yup.InferType<
  typeof createTransactionValidator>;
  export type TUpdateTransactionType = Yup.InferType< typeof updateTransactionValidator>;