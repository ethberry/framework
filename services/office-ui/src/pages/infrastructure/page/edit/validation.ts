import { object, string } from "yup";

import { draftValidationSchema, titleValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  slug: string()
    .matches(/^[0-9A-Z_-]+$/i, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
