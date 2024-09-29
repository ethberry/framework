import { object } from "yup";

import {
  urlValidationSchema,
  symbolValidationSchema,
  titleValidationSchema,
  currencyValidationSchema,
} from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  name: titleValidationSchema,
  symbol: symbolValidationSchema,
  baseTokenURI: urlValidationSchema,
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
