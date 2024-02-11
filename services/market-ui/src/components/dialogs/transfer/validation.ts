import { object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  amount: bigNumberValidationSchema
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .min(0, "form.validations.rangeUnderflow"),
});
