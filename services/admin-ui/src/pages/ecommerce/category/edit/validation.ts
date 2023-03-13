import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: Yup.string().required("form.validations.valueMissing"),
});
