import { object, string } from "yup";

import {
  draftValidationSchema,
  emailValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
} from "@ethberry/yup-rules";
import { addressValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  wallet: addressValidationSchema,
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
