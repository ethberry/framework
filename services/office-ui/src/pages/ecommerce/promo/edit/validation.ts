import { object } from "yup";

import { dbIdValidationSchema, titleValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  productId: dbIdValidationSchema,
  imageUrl: urlValidationSchema,
});
