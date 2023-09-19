import { object, string } from "yup";

import { draftValidationSchema, emailValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  wallet: addressValidationSchema,
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
  social: object().shape({
    facebookUrl: string(),
    instagramUrl: string(),
    youtubeUrl: string(),
    twitterUrl: string(),
  }),
});
