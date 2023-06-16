import { mixed, number, object, string } from "yup";

import { reEthAddress } from "@gemunion/constants";
import { TokenType } from "@framework/types";

export const validationSchema = object().shape({
  tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  mom: object().shape({
    address: string()
      .matches(reEthAddress, "form.validations.patternMismatch")
      .required("form.validations.valueMissing"),
    tokenId: number()
      .required("form.validations.valueMissing")
      .integer("form.validations.badInput")
      .min(1, "form.validations.rangeUnderflow"),
  }),
  dad: object().shape({
    address: string()
      .matches(reEthAddress, "form.validations.patternMismatch")
      .required("form.validations.valueMissing"),
    tokenId: number()
      .required("form.validations.valueMissing")
      .integer("form.validations.badInput")
      .min(1, "form.validations.rangeUnderflow"),
  }),
});
