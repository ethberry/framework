import { mixed, number, object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { dbIdValidationSchema } from "@gemunion/yup-rules";
import { TokenType } from "@framework/types";

export const validationSchema = object().shape({
  amount: bigNumberValidationSchema.required("form.validations.valueMissing").min(0, "form.validations.rangeUnderflow"),
  contract: object().shape({
    address: addressValidationSchema,
    tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
    decimals: number().required("form.validations.valueMissing"),
  }),
  contractId: dbIdValidationSchema,
});
