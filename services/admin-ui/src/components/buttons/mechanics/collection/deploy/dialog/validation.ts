import { number, object, string } from "yup";
import { symbolValidationSchema, titleValidationSchema, currencyValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  name: titleValidationSchema,
  symbol: symbolValidationSchema,
  baseTokenURI: string().required("form.validations.valueMissing"),
  royalty: currencyValidationSchema.max(10000, "form.validations.rangeOverflow"),
  batchSize: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
});
