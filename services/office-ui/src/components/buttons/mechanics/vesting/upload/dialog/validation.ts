import { array, object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

import { vestingValidationSchema } from "../../../../../../pages/mechanics/vesting/claim/edit/validation";

export const claimValidationSchema = object().concat(vestingValidationSchema).concat(templateAssetValidationSchema);

export const claimsValidationSchema = object().shape({
  claims: array().of(claimValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
});
