import * as Yup from "yup";
import { paginationValidation } from ".";

export const createBudgetValidator = Yup.object().shape({
  amount: Yup.number().required("Budget amount is required"),
  spent: Yup.number().required("Budget spent is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().required("End date is required"),
  categoryId: Yup.string().uuid().required("Category ID is required").uuid("Invalid ID format"),
});

export const updateBudgetValidator = Yup.object().shape({
  amount: Yup.number().optional(),
  spent: Yup.number().optional(),
  startDate: Yup.date().optional(),
  endDate: Yup.date().optional(),
  categoryId: Yup.string().uuid().optional().uuid("Invalid ID format"),
});

// export const getAllBudgetsValidator = Yup.object().shape({}).concat(paginationValidation);

//   // category: Yup.string().uuid().optional().uuid("Invalid ID format"),
//   // startDate: Yup.date().optional(),
//   // endDate: Yup.date().optional(),


export const getAllBudgetsValidator = Yup.object({
  category: Yup.string()
    .uuid("Invalid category ID format")
    .notRequired(),

  startDate: Yup.date()
    .typeError("startDate must be a valid date")
    .notRequired(),

  endDate: Yup.date()
    .typeError("endDate must be a valid date")
    .min(
      Yup.ref("startDate"),
      "endDate cannot be earlier than startDate"
    )
    .notRequired(),
}).concat(paginationValidation);

export const getBudgetByIdValidator = Yup.object().shape({
  id: Yup.string().uuid().required("ID is required").uuid("Invalid ID format"),

});

export type TCreateBudgetType = Yup.InferType<typeof createBudgetValidator>;
export type TUpdateBudgetType = Yup.InferType<typeof updateBudgetValidator>;
export type TGetAllBudgetsType = Yup.InferType<typeof getAllBudgetsValidator>;
export type TGetBudgetByIdType = Yup.InferType<typeof getBudgetByIdValidator>;