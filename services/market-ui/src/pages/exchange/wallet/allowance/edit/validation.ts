import { array, object } from "yup";

import {
  tokenAssetContractIdValidationSchema,
  tokenAssetTokenTypeValidationSchema,
  tokenAssetTokenValidationSchema,
} from "@gemunion/mui-inputs-asset";
import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            bigNumberValidationSchema
              .min(0, "form.validations.rangeUnderflow")
              .required("form.validations.valueMissing"),
        }),
      }),
    ),
  }),
  address: addressValidationSchema,
});
