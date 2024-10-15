import { array, object } from "yup";

import { jsonValidationSchema, urlValidationSchema } from "@ethberry/yup-rules";
import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";

export const tokenValidationSchema = object().shape({
  tokenId: bigNumberValidationSchema,
  imageUrl: urlValidationSchema,
  metadata: jsonValidationSchema,
});

export const tokensValidationSchema = object().shape({
  tokens: array().of(tokenValidationSchema).required("form.validations.valueMissing"),
});

export const validationSchema = object().shape({
  files: array().min(1, "form.validations.valueMissing"),
});
