import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  email: Yup.string().required("form.validations.valueMissing").email("form.validations.patternMismatch"),
});
