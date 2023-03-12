import { number, object } from "yup";

export const validationSchema = object().shape({
  royalty: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
});
