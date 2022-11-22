import * as Yup from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  amount: bigNumberValidationSchema.min(0, "form.validations.rangeUnderflow"),
});
