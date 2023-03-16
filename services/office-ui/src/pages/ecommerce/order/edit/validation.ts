import { number, object } from "yup";

export const validationSchema = object().shape({
  userId: number().required("form.validations.valueMissing"),
});
