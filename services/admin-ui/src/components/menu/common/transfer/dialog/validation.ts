import { array, object, mixed, number } from "yup";
import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

import { TokenType } from "@framework/types";

// TODO fix original MUI schema?
export const tokenZeroAssetComponentValidationSchema = object().shape({
  tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  contractId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  token: object().when("tokenType", {
    is: (tokenType: TokenType) => tokenType !== TokenType.ERC20 && tokenType !== TokenType.NATIVE,
    then: schema =>
      schema.shape({
        tokenId: number()
          .min(0, "form.validations.valueMissing")
          .integer("form.validations.badInput")
          .required("form.validations.valueMissing"),
      }),
  }),
  amount: bigNumberValidationSchema.when("tokenType", {
    is: (tokenType: TokenType) => tokenType !== TokenType.ERC721 && tokenType !== TokenType.ERC998,
    then: () =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  }),
});

export const tokenZeroAssetValidationSchema = object().shape({
  components: array().of(tokenZeroAssetComponentValidationSchema),
});

export const validationSchema = object().shape({
  token: tokenZeroAssetValidationSchema,
  address: addressValidationSchema,
});
