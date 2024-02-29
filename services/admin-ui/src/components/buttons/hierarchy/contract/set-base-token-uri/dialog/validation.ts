import { object, string } from "yup";

export const validationSchema = object().shape({
  baseTokenURI: string().required("form.validations.valueMissing"),
});
