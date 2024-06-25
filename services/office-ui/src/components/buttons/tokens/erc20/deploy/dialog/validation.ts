import { BigNumber } from "ethers";
import { object } from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { symbolValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  name: titleValidationSchema,
  symbol: symbolValidationSchema,
  cap: bigNumberValidationSchema
    .min(1, "form.validations.rangeUnderflow")
    .max(
      BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
      "form.validations.rangeOverflow",
    ),
});
