import { array, number, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const claimValidationSchema = object().shape({
  account: addressValidationSchema,
});

export const claimsValidationSchema = object().shape({
  items: array().of(claimValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
  listId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
