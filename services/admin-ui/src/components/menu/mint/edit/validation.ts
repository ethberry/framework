import * as Yup from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { TokenType } from "@framework/types";

export const validationSchema = Yup.object().shape({
  tokenType: Yup.mixed<TokenType>().oneOf(Object.values(TokenType)),
  address: Yup.string().required("form.validations.valueMissing"),
  contractId: Yup.number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
  templateId: Yup.number().when("tokenType", {
    is: (tokenType: TokenType) => tokenType !== TokenType.ERC20,
    then: Yup.number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
  }),
  amount: bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow"),
  account: Yup.string().required("form.validations.valueMissing"),
});
