import { object } from "yup";

import {
  tokenAssetContractIdValidationSchema,
  tokenAssetTokenTypeValidationSchema,
  tokenAssetTokenValidationSchema,
} from "@gemunion/mui-inputs-asset";
import { TokenType } from "@gemunion/types-blockchain";
import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  token: object().shape({
    tokenType: tokenAssetTokenTypeValidationSchema,
    contractId: tokenAssetContractIdValidationSchema,
    token: tokenAssetTokenValidationSchema,
    amount: bigNumberValidationSchema.when("tokenType", {
      is: (tokenType: TokenType) => tokenType !== TokenType.ERC721 && tokenType !== TokenType.ERC998,
      then: () =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        bigNumberValidationSchema.min(0, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
    }),
  }),
  address: addressValidationSchema,
});
