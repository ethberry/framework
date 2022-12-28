import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  maxStake: Yup.number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(1, "form.validations.rangeUnderflow"),
});
