import * as Yup from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { TokenType } from "@framework/types";

export const tokenComponentValidationSchema = Yup.object().shape({
  tokenType: Yup.mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  contractId: Yup.number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  tokenId: Yup.number().when("tokenType", {
    is: (tokenType: TokenType) => tokenType !== TokenType.ERC20,
    then: Yup.number()
      .min(1, "form.validations.valueMissing")
      .integer("form.validations.badInput")
      .required("form.validations.valueMissing"),
  }),
  amount: bigNumberValidationSchema,
});

export const tokenValidationSchema = Yup.object().shape({
  components: Yup.array().of(tokenComponentValidationSchema),
});
