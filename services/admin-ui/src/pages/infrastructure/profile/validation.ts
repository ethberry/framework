import { object, string } from "yup";

import { emailValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  displayName: string().required("form.validations.valueMissing"),
});
