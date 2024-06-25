import { number, object } from "yup";

import { draftValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema, tokenAssetContractIdValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  contractId: tokenAssetContractIdValidationSchema,
  title: titleValidationSchema,
  description: draftValidationSchema,
  deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  durationAmount: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  penalty: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow")
    .max(10000, "form.validations.rangeUnderflow"),
  maxCycles: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
});
