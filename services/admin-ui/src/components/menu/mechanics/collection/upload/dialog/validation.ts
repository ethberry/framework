import { array, object } from "yup";

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
});
