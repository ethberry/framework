import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  slug: Yup.string()
    .matches(/^[0-9A-Z_-]+$/i, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
