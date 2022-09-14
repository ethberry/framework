import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  tokenId: Yup.number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
