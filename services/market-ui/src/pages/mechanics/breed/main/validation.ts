import { mixed, object, string } from "yup";

import { reEthAddress } from "@gemunion/constants";
import { TokenType } from "@framework/types";
import { dbIdValidationSchema } from "../../../../components/validation";

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
