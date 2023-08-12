import { object, string } from "yup";

import { draftValidationSchema, emailValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
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
