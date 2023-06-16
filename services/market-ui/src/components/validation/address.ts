import { object, string } from "yup";

// this is physical address not ETH
export const addressValidationSchema = object().shape({
  address: string().required("form.validations.valueMissing"),
});
