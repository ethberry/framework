import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  beneficiary: Yup.string().required("form.validations.valueMissing"),
});
