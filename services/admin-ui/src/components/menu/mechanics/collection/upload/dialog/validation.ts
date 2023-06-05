import { array, object, string } from "yup";

import { jsonValidationSchema } from "@gemunion/yup-rules";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const tokenValidationSchema = object().shape({
  tokenId: bigNumberValidationSchema,
  imageUrl: string().required("form.validations.valueMissing"),
  metadata: jsonValidationSchema,
});

export const tokensValidationSchema = object().shape({
  tokens: array().of(tokenValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
});
