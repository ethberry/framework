import { number, object } from "yup";

export const validationSchema = object().shape({
  addressId: number().required("form.validations.valueMissing"),
});
