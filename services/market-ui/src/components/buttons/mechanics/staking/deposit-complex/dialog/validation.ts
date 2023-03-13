import { number, object } from "yup";

export const validationSchema = object().shape({
  tokenId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
