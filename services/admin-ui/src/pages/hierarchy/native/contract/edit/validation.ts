import { object } from "yup";

import { draftValidationSchema, symbolValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  symbol: symbolValidationSchema,
  title: titleValidationSchema,
  description: draftValidationSchema,
});
