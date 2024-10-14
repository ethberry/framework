import { boolean, mixed, number, object } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { dbIdValidationSchema } from "@ethberry/yup-rules";
import { DurationUnit } from "@framework/types";

export const validationSchema = object().shape({
  deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
  durationUnit: mixed<DurationUnit>().oneOf(Object.values(DurationUnit)).required("form.validations.valueMissing"),
  durationAmount: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  penalty: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow")
    .max(10000, "form.validations.rangeUnderflow"),
  maxStake: number(),
  recurrent: boolean(),
  advance: boolean(),
});
