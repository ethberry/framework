import { object } from "yup";

import {
  urlValidationSchema,
  symbolValidationSchema,
  titleValidationSchema,
  currencyValidationSchema,
} from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  name: titleValidationSchema,
  symbol: symbolValidationSchema,
  baseTokenURI: urlValidationSchema,
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
