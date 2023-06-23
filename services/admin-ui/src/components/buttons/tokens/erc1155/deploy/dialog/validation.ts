import { number, object, string } from "yup";

export const validationSchema = object().shape({
  baseTokenURI: string().required("form.validations.valueMissing"),
  royalty: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
});
