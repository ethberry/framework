import { array, mixed, number, object, string } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { reISO8601 } from "@gemunion/constants";
import { TokenType } from "@framework/types";

export const claimValidationSchema = object().shape({
  // vesting
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

  // item
  tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  address: addressValidationSchema,
  templateId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  amount: bigNumberValidationSchema,
});

export const claimsValidationSchema = object().shape({
  claims: array().of(claimValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
});
