import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  address: Yup.string().required("form.validations.valueMissing"),
});
