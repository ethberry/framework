import { object, number } from "yup";

export const validationSchema = object().shape({
  vrfSubId: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
