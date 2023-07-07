import { number, object } from "yup";

export const validationSchema = object().shape({
  timeLagBeforeRelease: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  commission: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(100, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
});
