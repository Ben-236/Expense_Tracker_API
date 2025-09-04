import * as Yup from "yup";
import { paginationValidation } from ".";

export const createCategoryValidator = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
});

export const updateCategoryValidator = Yup.object().shape({
  name: Yup.string().optional(),
});

export const getAllCategoriesValidator = Yup.object().shape({}).concat(paginationValidation);

export const getCategoryByIdValidator = Yup.object().shape({
  id: Yup.string().uuid().required("ID is required").uuid("Invalid ID format"),
});

export type TCreateCategoryType = Yup.InferType<typeof createCategoryValidator>;
export type TUpdateCategoryType = Yup.InferType<typeof updateCategoryValidator>;
export type TGetAllCategoriesType = Yup.InferType<typeof getAllCategoriesValidator>;
export type TGetCategoryByIdType = Yup.InferType<typeof getCategoryByIdValidator>;