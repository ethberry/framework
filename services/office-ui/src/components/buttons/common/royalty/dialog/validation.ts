import { object } from "yup";
import { currencyValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
