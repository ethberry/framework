import { array, object } from "yup";

import {
  tokenAssetContractIdValidationSchema,
  tokenAssetTokenTypeValidationSchema,
  tokenAssetTokenValidationSchema,
} from "@ethberry/mui-inputs-asset";
import { addressValidationSchema, bigNumberValidationSchema } from "@ethberry/yup-rules-eth";
import { TokenType } from "@framework/types";

export const validationSchema = object().shape({
  token: object().shape({
    components: array().of(
      object().shape({
        tokenType: tokenAssetTokenTypeValidationSchema,
        contractId: tokenAssetContractIdValidationSchema,
        token: tokenAssetTokenValidationSchema,
        amount: bigNumberValidationSchema.when("tokenType", {
          is: (tokenType: TokenType) => tokenType !== TokenType.ERC721 && tokenType !== TokenType.ERC998,
          then: () =>
            bigNumberValidationSchema
              .min(0, "form.validations.rangeUnderflow") // <- this is custom
              .required("form.validations.valueMissing"),
        }),
      }),
    ),
  }),
  address: addressValidationSchema,
});
