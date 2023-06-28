import { number, object, string } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { reISO8601 } from "@gemunion/constants";

export const vestingValidationSchema = object().shape({
  beneficiary: addressValidationSchema,
  startTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  cliffInMonth: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  monthlyRelease: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(1, "form.validations.rangeUnderflow"),
});

export const validationSchema = object().shape({
  parameters: vestingValidationSchema,
  item: templateAssetValidationSchema,
});
