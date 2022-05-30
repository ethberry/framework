import * as Yup from "yup";

import {
  confirmValidationSchema,
  displayNameValidationSchema,
  emailValidationSchema,
  passwordValidationSchema,
} from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  email: emailValidationSchema,
  password: passwordValidationSchema,
  confirm: confirmValidationSchema,
  displayName: displayNameValidationSchema,
});
