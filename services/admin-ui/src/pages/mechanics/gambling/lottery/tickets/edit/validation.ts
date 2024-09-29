import { object } from "yup";

import { draftValidationSchema, titleValidationSchema, urlValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
});
