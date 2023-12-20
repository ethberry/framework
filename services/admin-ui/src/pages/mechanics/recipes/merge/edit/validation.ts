import { mixed, object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { MergeStatus } from "@framework/types";

export const validationSchema = object().shape({
  item: templateAssetValidationSchema,
  // TODO fix validation, allow template = null or 0
  // price: templateAssetValidationSchema,
  mergeStatus: mixed<MergeStatus>().oneOf(Object.values(MergeStatus)).required("form.validations.valueMissing"),
});
