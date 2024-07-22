import { object, string } from "yup";
import { currencyValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  baseTokenURI: string().required("form.validations.valueMissing"),
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
});
