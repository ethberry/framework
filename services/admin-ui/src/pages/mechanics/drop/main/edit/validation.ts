import * as Yup from "yup";

import { reISO8601 } from "@gemunion/constants";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = Yup.object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  startTimestamp: Yup.string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  endTimestamp: Yup.string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
