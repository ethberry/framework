import { object } from "yup";

import { draftValidationSchema, titleValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
});
