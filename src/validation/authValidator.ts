import * as Yup from "yup";
import { paginationValidation } from ".";

export const createUserValidator = Yup.object().shape({
  firstName: Yup.string().required("User first name is required"),
  lastName: Yup.string().required("User last name is required"),
  email: Yup.string()
    .email("Please provide a valid email")
    .required("User email is required"),
  phoneNumber: Yup.string()
    .matches(
      /^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
      "Phone number must be in international format"
    )
    .required("User phone number is required"),
  password: Yup.string().required("User password is required"),
  roleId: Yup.string().required("User role is required"),
  permissions: Yup.array().of(Yup.string().required()),
});

export const userLoginValidator = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email")
    .required("User email is required"),
  password: Yup.string().required("User password is required"),
});

export const forgotPasswordValidator = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email")
    .required("User email is required"),
});

export const resetPasswordValidator = Yup.object().shape({
  password: Yup.string().required(),
});

export const getAllUsersValidator = Yup.object()
  .shape({})
  .concat(paginationValidation);

export const getUserByIdValidator = Yup.object().shape({
  id: Yup.string().uuid().required("ID is required").uuid("Invalid ID format"),
});

export const updateUserValidator = createUserValidator.omit([
  "password",
  "email",
]);

export const userUpdatePasswordValidator = Yup.object().shape({
  oldPassword: Yup.string().min(8).max(15).required("Old password is required"),
  newPassword: Yup.string().min(8).max(15).required("New password is required"),
});

export type TCreateUserType = Yup.InferType<typeof createUserValidator>;
export type TUpdateUserType = Yup.InferType<typeof updateUserValidator>;
export type TUserLoginType = Yup.InferType<typeof userLoginValidator>;
export type TForgotPasswordType = Yup.InferType<typeof forgotPasswordValidator>;
export type TResetPasswordType = Yup.InferType<typeof resetPasswordValidator>;
export type TGetAllUsersType = Yup.InferType<typeof getAllUsersValidator>;
export type TGetUserByIdType = Yup.InferType<typeof getUserByIdValidator>;
export type TUserUpdatePasswordType = Yup.InferType<
  typeof userUpdatePasswordValidator
>;
