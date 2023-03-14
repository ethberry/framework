import { object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  slug: string()
    .matches(/^[0-9A-Z_-]+$/i, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
