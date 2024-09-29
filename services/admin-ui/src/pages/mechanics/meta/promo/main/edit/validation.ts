import { object, string } from "yup";

import { reISO8601 } from "@ethberry/constants";
import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";

export const validationSchema = object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  startTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
