import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("form.validations.valueMissing"),
  symbol: Yup.string().required("form.validations.valueMissing"),
  baseTokenURI: Yup.string().required("form.validations.valueMissing"),
  royalty: Yup.number().required("form.validations.valueMissing"),
});
