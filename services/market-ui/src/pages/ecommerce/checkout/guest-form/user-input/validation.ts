import { object } from "yup";

import {
  confirmValidationSchema,
  displayNameValidationSchema,
  emailValidationSchema,
  passwordValidationSchema,
} from "@gemunion/yup-rules";

export const userWithoutPasswordValidationSchema = object().shape({
  email: emailValidationSchema,
  displayName: displayNameValidationSchema,
});

export const userWithPasswordValidationSchema = object().shape({
  email: emailValidationSchema,
  displayName: displayNameValidationSchema,
  password: passwordValidationSchema,
  confirm: confirmValidationSchema,
});
