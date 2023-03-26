import { object, string } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { reISO8601 } from "@gemunion/constants";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  expires: string().matches(reISO8601, "form.validations.patternMismatch").required("form.validations.valueMissing"),
});
