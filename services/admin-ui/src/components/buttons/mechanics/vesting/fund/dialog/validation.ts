import * as Yup from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  contractId: Yup.number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
  amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
});
