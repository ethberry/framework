import { object, string } from "yup";

export const validationSchema = object().shape({
  account: string().required("form.validations.valueMissing"),
});
