import { object } from "yup";

import { emailValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
});
