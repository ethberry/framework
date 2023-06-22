import { object, string } from "yup";

export const validationSchema = object().shape({
  attribute: string()
    .required("form.validations.valueMissing")
    .matches(/^[0-9A-Z]+$/, "form.validations.patternMismatch")
    .max(32, "form.validations.rangeOverflow"),
});
