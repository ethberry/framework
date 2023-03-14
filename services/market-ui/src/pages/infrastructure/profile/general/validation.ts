import { object, string } from "yup";

import { EnabledLanguages } from "@framework/constants";
import { displayNameValidationSchema, emailValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  displayName: displayNameValidationSchema,
  language: string().oneOf(Object.values(EnabledLanguages)),
});
