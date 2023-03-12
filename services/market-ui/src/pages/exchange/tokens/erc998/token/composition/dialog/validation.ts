import { object } from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
});
