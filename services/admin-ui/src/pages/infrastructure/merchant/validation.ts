import { object, string } from "yup";

import { draftValidationSchema, emailValidationSchema } from "@gemunion/yup-rules";
import { urlValidationSchema } from "../../../components/validation";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
  social: object().shape({
    facebookUrl: urlValidationSchema.optional(),
    instagramUrl: urlValidationSchema.optional(),
    youtubeUrl: urlValidationSchema.optional(),
    twitterUrl: urlValidationSchema.optional(),
  }),
});
