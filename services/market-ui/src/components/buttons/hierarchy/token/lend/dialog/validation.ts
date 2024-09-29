import { object, string } from "yup";

import { addressValidationSchema } from "@ethberry/yup-rules-eth";
import { reISO8601 } from "@ethberry/constants";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  expires: string().matches(reISO8601, "form.validations.patternMismatch").required("form.validations.valueMissing"),
});
