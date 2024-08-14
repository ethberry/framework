import { object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  address: addressValidationSchema,
  amount: bigNumberValidationSchema.required("form.validations.valueMissing"),
});
