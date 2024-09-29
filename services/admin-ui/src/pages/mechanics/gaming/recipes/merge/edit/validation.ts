import { mixed, object } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { MergeStatus } from "@framework/types";

export const validationSchema = object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  mergeStatus: mixed<MergeStatus>().oneOf(Object.values(MergeStatus)).required("form.validations.valueMissing"),
});
