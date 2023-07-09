import { mixed, number, object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { TokenType } from "@framework/types";

import { dbIdValidationSchema } from "../../../../../validation";

export const validationSchema = object().shape({
  amount: bigNumberValidationSchema
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .min(0, "form.validations.rangeUnderflow"),
  contract: object().shape({
    address: addressValidationSchema,
    tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
    decimals: number().required("form.validations.valueMissing"),
  }),
  contractId: dbIdValidationSchema,
});
