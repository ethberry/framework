import { object, string } from "yup";

export const addressValidationSchema = object().shape({
  address: string().required("form.validations.valueMissing"),
});
