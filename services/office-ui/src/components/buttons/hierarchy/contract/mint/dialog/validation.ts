import { array, number, object } from "yup";

import { addressValidationSchema } from "@ethberry/yup-rules-eth";
import {
  templateAssetValidationSchema,
  tokenAssetAmountValidationSchema,
  tokenAssetTokenTypeValidationSchema,
} from "@ethberry/mui-inputs-asset";
import { dbIdValidationSchema } from "@ethberry/yup-rules";
import { TokenType } from "@framework/types";

export const tokenAssetComponentValidationSchema = object().shape({
  amount: tokenAssetAmountValidationSchema,
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
  tokenType: tokenAssetTokenTypeValidationSchema,
});

export const tokenMintAssetValidationSchema = object().shape({
  components: array().of(tokenAssetComponentValidationSchema),
});

export const validationSchema = object().shape({
  account: addressValidationSchema,
  template: templateAssetValidationSchema,
  token: tokenMintAssetValidationSchema,
});
