import { object } from "yup";

import { currencyValidationSchema, urlValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  baseTokenURI: urlValidationSchema,
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
