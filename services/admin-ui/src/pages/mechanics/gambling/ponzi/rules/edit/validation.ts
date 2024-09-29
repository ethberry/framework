import { object } from "yup";

import { draftValidationSchema, titleValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  // TODO add more validation here
});
