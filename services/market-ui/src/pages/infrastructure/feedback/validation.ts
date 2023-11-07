import { object, string } from "yup";

export const validationSchema = object().shape({
  text: string().required("form.validations.valueMissing").min(42, "form.validations.rangeUnderflow"),
});
