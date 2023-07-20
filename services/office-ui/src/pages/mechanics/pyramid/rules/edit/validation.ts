import { boolean, number, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema, tokenAssetContractIdValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  contractId: tokenAssetContractIdValidationSchema,
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  duration: number()
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
  recurrent: boolean(),
});
