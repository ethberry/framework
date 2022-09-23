import * as Yup from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { TokenType } from "@framework/types";

export const validationSchema = Yup.object().shape({
  tokenType: Yup.mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  contract: Yup.object().shape({
    main: Yup.string().required("form.validations.valueMissing"),
    custom: Yup.string().required("form.validations.valueMissing"),
  }),
  contractId: Yup.number().required("form.validations.valueMissing"),
  amount: bigNumberValidationSchema.min(0, "form.validations.rangeUnderflow"),
});
