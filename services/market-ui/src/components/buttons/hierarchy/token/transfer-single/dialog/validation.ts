import { object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
});
