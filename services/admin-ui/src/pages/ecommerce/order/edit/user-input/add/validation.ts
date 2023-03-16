import { object, string } from "yup";

export const validationSchema = object().shape({
  email: string().required("form.validations.valueMissing").email("form.validations.patternMismatch"),
});
