import * as Yup from "yup";

import { TokenType } from "@framework/types";

export const validationSchema = Yup.object().shape({
  tokenType: Yup.mixed<TokenType>().oneOf(Object.values(TokenType)).required("form.validations.valueMissing"),
  mom: Yup.object().shape({
    address: Yup.string().required("form.validations.valueMissing"),
    tokenId: Yup.number()
      .required("form.validations.valueMissing")
      .integer("form.validations.badInput")
      .min(1, "form.validations.rangeUnderflow"),
  }),
  dad: Yup.object().shape({
    address: Yup.string().required("form.validations.valueMissing"),
    tokenId: Yup.number()
      .required("form.validations.valueMissing")
      .integer("form.validations.badInput")
      .min(1, "form.validations.rangeUnderflow"),
  }),
});
