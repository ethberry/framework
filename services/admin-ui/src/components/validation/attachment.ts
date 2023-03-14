import { object, string } from "yup";

export const attachmentValidationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  url: string().required("form.validations.valueMissing"),
});
