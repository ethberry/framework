import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  baseTokenURI: Yup.string().required("form.validations.valueMissing"),
  royalty: Yup.number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(1000, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
});
