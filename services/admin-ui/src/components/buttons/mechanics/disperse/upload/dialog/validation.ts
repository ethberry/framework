import { array, mixed, number, object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { TokenType } from "@framework/types";

export const disperseValidationSchema = object().shape({
  account: addressValidationSchema,
  tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  token: addressValidationSchema,
  tokenId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  amount: bigNumberValidationSchema,
});

export const dispersesValidationSchema = object().shape({
  disperses: array().of(disperseValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
});
