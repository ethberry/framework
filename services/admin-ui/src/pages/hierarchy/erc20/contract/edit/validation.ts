import { mixed, number, object } from "yup";

import {
  draftValidationSchema,
  symbolValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
} from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { ContractStatus } from "@framework/types";

export const editValidationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
  contractStatus: mixed<ContractStatus>()
    .oneOf(Object.values(ContractStatus))
    .required("form.validations.valueMissing"),
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
});
