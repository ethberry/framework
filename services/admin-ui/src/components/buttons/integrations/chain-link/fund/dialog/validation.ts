import { object, string } from "yup";

import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  subscriptionId: string().required("form.validations.valueMissing"),
  amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
});
