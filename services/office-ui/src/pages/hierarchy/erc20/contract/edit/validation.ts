import { number, object } from "yup";

import {
  dbIdValidationSchema,
  draftValidationSchema,
  symbolValidationSchema,
  titleValidationSchema,
} from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const editValidationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  merchantId: dbIdValidationSchema,
});

export const createValidationSchema = object().shape({
  symbol: symbolValidationSchema,
  title: titleValidationSchema,
  description: draftValidationSchema,
  address: addressValidationSchema,
  decimals: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .max(32, "form.validations.rangeOverflow"),
  merchantId: dbIdValidationSchema,
});
