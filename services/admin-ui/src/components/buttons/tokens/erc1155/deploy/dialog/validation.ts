import { object } from "yup";

import { currencyValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  baseTokenURI: urlValidationSchema,
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
