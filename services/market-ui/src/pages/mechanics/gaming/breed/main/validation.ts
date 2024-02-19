import { mixed, object, string } from "yup";

import { reEthAddress } from "@gemunion/constants";
import { dbIdValidationSchema } from "@gemunion/yup-rules";
import { TokenType } from "@framework/types";

export const validationSchema = object().shape({
  tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  mom: object().shape({
    address: string()
      .matches(reEthAddress, "form.validations.patternMismatch")
      .required("form.validations.valueMissing"),
    tokenId: dbIdValidationSchema,
  }),
  dad: object().shape({
    address: string()
      .matches(reEthAddress, "form.validations.patternMismatch")
      .required("form.validations.valueMissing"),
    tokenId: dbIdValidationSchema,
  }),
});
