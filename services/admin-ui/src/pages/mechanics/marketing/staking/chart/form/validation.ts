import { number, object, string } from "yup";

import { reISO8601 } from "@gemunion/constants";

export const validationSchema = object().shape({
  contractId: number().min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  deposit: object().shape({
    contractId: number().min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  }),
  reward: object().shape({
    contractId: number().min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  }),
  startTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
