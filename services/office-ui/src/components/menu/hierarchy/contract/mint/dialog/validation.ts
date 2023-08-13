import { array, mixed, number, object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { dbIdValidationSchema } from "@gemunion/yup-rules";
import { TokenType } from "@framework/types";

// TODO better TOKEN validation

export const tokenAssetComponentValidationSchema = object().shape({
  amount: bigNumberValidationSchema.when("tokenType", {
    is: (tokenType: TokenType) => tokenType !== TokenType.ERC721 && tokenType !== TokenType.ERC998,
    then: () =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  }),
  contract: object().shape({
    decimals: number()
      .min(0, "form.validations.valueMissing")
      .integer("form.validations.badInput")
      .required("form.validations.valueMissing"),
    address: addressValidationSchema,
  }),
  contractId: dbIdValidationSchema,
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
  tokenId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  templateId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
  tokenType: mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
});

export const tokenMintAssetValidationSchema = object().shape({
  components: array().of(tokenAssetComponentValidationSchema),
});

export const validationSchema = object().shape({
  account: addressValidationSchema,
  template: templateAssetValidationSchema,
  token: tokenMintAssetValidationSchema,
});
