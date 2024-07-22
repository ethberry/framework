import { object, string } from "yup";
import { symbolValidationSchema, titleValidationSchema, currencyValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  name: titleValidationSchema,
  symbol: symbolValidationSchema,
  baseTokenURI: string().required("form.validations.valueMissing"),
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
