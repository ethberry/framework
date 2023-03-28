import { number, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const editValidationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  merchantId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});

export const createValidationSchema = object().shape({
  symbol: string().required("form.validations.valueMissing").max(32, "form.validations.tooLong"),
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  address: addressValidationSchema,
  decimals: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .max(32, "form.validations.rangeOverflow"),
  merchantId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
