import { object } from "yup";

import { dbIdValidationSchema, titleValidationSchema, urlValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  productId: dbIdValidationSchema,
  imageUrl: urlValidationSchema,
});
