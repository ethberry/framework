import { number, object } from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  contractId: number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
  amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
});
