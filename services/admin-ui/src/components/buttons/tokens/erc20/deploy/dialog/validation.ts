import { BigNumber } from "ethers";
import { object } from "yup";

import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";
import { symbolValidationSchema, titleValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  name: titleValidationSchema,
  symbol: symbolValidationSchema,
  cap: bigNumberValidationSchema
    .required("form.validations.valueMissing")
    .min(1, "form.validations.rangeUnderflow")
    .max(
      BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
      "form.validations.rangeOverflow",
    ),
});
