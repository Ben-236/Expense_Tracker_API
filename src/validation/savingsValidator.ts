import * as Yup from "yup";

export const createSavingsValidator = Yup.object().shape({
  name: Yup.string().required("Savings goal name is required"),
  target: Yup.number().required("Savings goal target is required"),
  deadline: Yup.date().nullable(),
});

export const updateSavingsValidator = Yup.object().shape({
  name: Yup.string().nullable(),
  target: Yup.number().nullable(),
  deadline: Yup.date().nullable(),
});

export const getAllSavingsValidator = Yup.object().shape({});

export const getSavingsByIdValidator = Yup.object().shape({
  id: Yup.string().uuid().required("ID is required").uuid("Invalid ID format"),
});

export type TCreateSavingsType = Yup.InferType<typeof createSavingsValidator>;
export type TUpdateSavingsType = Yup.InferType<typeof updateSavingsValidator>;
export type TGetAllSavingsType = Yup.InferType<typeof getAllSavingsValidator>;
export type TGetSavingsByIdType = Yup.InferType<typeof getSavingsByIdValidator>;
