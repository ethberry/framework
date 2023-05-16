import { object, string } from "yup";

export const validationSchema = object().shape({
  address: string().required("form.validations.valueMissing"),
});
