import { object, string } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { reISO8601 } from "@gemunion/constants";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  item: templateAssetValidationSchema,
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
