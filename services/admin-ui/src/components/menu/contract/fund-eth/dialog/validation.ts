import { number, object } from "yup";

export const validationSchema = object().shape({
  amount: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
});
