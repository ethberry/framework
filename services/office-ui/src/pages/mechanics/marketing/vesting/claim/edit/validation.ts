import { number, object, string } from "yup";

import { currencyValidationSchema } from "@ethberry/yup-rules";
import { addressValidationSchema } from "@ethberry/yup-rules-eth";
import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { reISO8601 } from "@ethberry/constants";

export const vestingValidationSchema = object().shape({
  owner: addressValidationSchema,
  startTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  cliffInMonth: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  monthlyRelease: currencyValidationSchema
    .max(10000, "form.validations.rangeOverflow")
    .min(1, "form.validations.rangeUnderflow"),
});

export const validationSchema = object().shape({
  parameters: vestingValidationSchema,
  item: templateAssetValidationSchema,
});
