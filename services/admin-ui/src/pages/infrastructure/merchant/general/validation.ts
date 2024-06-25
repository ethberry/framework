import { object, string } from "yup";

import {
  draftValidationSchema,
  emailValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
} from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  title: titleValidationSchema,
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
  social: object().shape({
    facebookUrl: string(),
    instagramUrl: string(),
    youtubeUrl: string(),
    twitterUrl: string(),
  }),
});
