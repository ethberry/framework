import * as Yup from "yup";

export const attachmentValidationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  url: Yup.string().required("form.validations.valueMissing"),
});
