import { object } from "yup";
import { currencyValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
