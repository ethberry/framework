import { array, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { dbIdValidationSchema } from "@gemunion/yup-rules";

export const claimValidationSchema = object().shape({
  account: addressValidationSchema,
});

export const claimsValidationSchema = object().shape({
  items: array().of(claimValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
  listId: dbIdValidationSchema,
});
