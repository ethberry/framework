import { object, string } from "yup";

export const validationSchema = object().shape({
  attribute: string()
    .required("form.validations.valueMissing")
    .matches(/^[a-zA-Z0-9_.-]*$/, "form.validations.patternMismatch")
    .max(32, "form.validations.rangeOverflow"),
});
