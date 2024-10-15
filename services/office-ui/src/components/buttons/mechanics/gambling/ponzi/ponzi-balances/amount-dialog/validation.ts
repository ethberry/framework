import { object } from "yup";

import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
});
