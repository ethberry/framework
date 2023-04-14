import { object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const editValidationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
});

export const createValidationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
});
