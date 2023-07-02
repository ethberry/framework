import { object, string } from "yup";

import { draftValidationSchema, emailValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  imageUrl: string().required("form.validations.valueMissing"),
});
