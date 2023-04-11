import { number, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  contractId: number()
    .typeError("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow")
    .required("form.validations.valueMissing"),
  mysteryId: number()
    .typeError("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow")
    .required("form.validations.valueMissing"),
});
