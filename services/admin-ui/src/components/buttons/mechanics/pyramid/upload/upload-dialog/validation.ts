import { number, object } from "yup";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

// TODO add more validation
export const validationSchema = object().shape({
  deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  content: templateAssetValidationSchema,
  contractId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
