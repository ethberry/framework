import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  account: Yup.string().required("form.validations.valueMissing"),
});
