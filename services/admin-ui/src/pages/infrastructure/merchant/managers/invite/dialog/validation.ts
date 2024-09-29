import { object } from "yup";

import { emailValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
});
