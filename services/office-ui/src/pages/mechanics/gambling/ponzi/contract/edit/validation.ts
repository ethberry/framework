import { object } from "yup";

import { draftValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
});
