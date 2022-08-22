import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  files: Yup.array().min(1, "form.validations.valueMissing"),
});
