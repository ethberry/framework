import { object, string } from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  name: string().required("form.validations.valueMissing"),
  symbol: string().required("form.validations.valueMissing").max(32, "form.validations.rangeUnderflow"),
  cap: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
});
