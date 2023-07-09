import { number } from "yup";

export const dbIdValidationSchema = number()
  .typeError("form.validations.badInput")
  .required("form.validations.valueMissing")
  .min(1, "form.validations.rangeUnderflow");
