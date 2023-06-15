import { array, mixed, number, object, string } from "yup";

import { TokenType } from "@framework/types";
import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { reISO8601, reEthAddress } from "@gemunion/constants";

export const claimValidationSchema = object().shape({
  account: addressValidationSchema,
  tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  address: string().matches(reEthAddress, "form.validations.patternMismatch").required("form.validations.valueMissing"),
  templateId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  amount: bigNumberValidationSchema,
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing")
    .test("is-valid", "form.validations.rangeUnderflow", (value: string | undefined) => {
      if (!value) {
        return false;
      }
      if (value === new Date(0).toISOString()) {
        return true;
      }
      return new Date(value).getTime() > new Date().getTime();
    }),
});

export const claimsValidationSchema = object().shape({
  claims: array().of(claimValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
});
