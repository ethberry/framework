import { number, object } from "yup";

export const validationSchema = object().shape({
  userId: number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
  addressId: number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
});
