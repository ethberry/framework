import { number, object } from "yup";

import { addressValidationSchema, bigNumberValidationSchema } from "@ethberry/yup-rules-eth";
import { dbIdValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  amount: bigNumberValidationSchema
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .min(0, "form.validations.rangeUnderflow"),
  contract: object().shape({
    address: addressValidationSchema,
    decimals: number().required("form.validations.valueMissing"),
  }),
  contractId: dbIdValidationSchema,
});
