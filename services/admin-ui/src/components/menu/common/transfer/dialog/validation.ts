import { array, number, object } from "yup";

import { tokenAssetAmountValidationSchema, tokenAssetTokenTypeValidationSchema } from "@gemunion/mui-inputs-asset";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

import { TokenType } from "@framework/types";

import { dbIdValidationSchema } from "../../../../validation";

export const tokenZeroAssetComponentValidationSchema = object().shape({
  tokenType: tokenAssetTokenTypeValidationSchema,
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
  amount: tokenAssetAmountValidationSchema,
});

export const tokenZeroAssetValidationSchema = object().shape({
  components: array().of(tokenZeroAssetComponentValidationSchema),
});

export const validationSchema = object().shape({
  token: tokenZeroAssetValidationSchema,
  address: addressValidationSchema,
});
