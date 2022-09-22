import * as Yup from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { reISO8601 } from "@gemunion/constants";

export const validationSchema = Yup.object().shape({
  account: addressValidationSchema,
  startTimestamp: Yup.string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
