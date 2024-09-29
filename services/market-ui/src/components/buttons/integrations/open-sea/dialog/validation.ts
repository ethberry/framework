import { object, string } from "yup";
import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { reISO8601 } from "@ethberry/constants";

export const validationSchema = object().shape({
  price: templateAssetValidationSchema,
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
