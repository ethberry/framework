import { mixed, number, object, string } from "yup";

import { currencyValidationSchema } from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { reISO8601 } from "@gemunion/constants";
import { VestingContractTemplates } from "@framework/types";

export const validationSchema = object().shape({
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
  contractTemplate: mixed<VestingContractTemplates>()
    .oneOf(Object.values(VestingContractTemplates))
    .required("form.validations.valueMissing"),
});
