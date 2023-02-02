import * as Yup from "yup";

import { templateAssetComponentValidationSchema } from "@gemunion/mui-inputs-asset";
import { addressValidationSchema, bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { TokenType } from "@framework/types";

export const validationSchema = templateAssetComponentValidationSchema.concat(
  Yup.object().shape({
    address: addressValidationSchema,
    account: addressValidationSchema,
    amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
    tokenId: Yup.number().when("tokenType", {
      is: (tokenType: TokenType) => tokenType !== TokenType.ERC20,
      then: Yup.number()
        .min(0, "form.validations.valueMissing")
        .integer("form.validations.badInput")
        .required("form.validations.valueMissing"),
    }),
  }),
);
