import { number, object, string } from "yup";

export const validationSchema = object().shape({
  name: string().required("form.validations.valueMissing"),
  symbol: string().required("form.validations.valueMissing").max(32, "form.validations.rangeUnderflow"),
  baseTokenURI: string().required("form.validations.valueMissing"),
  royalty: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
  batchSize: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
});
