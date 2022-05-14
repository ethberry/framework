import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("form.validations.valueMissing"),
  symbol: Yup.string().required("form.validations.valueMissing"),
  amount: Yup.number().required("form.validations.valueMissing"),
});
