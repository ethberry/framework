import { object, string } from "yup";

import { EnabledCountries, EnabledGenders } from "@gemunion/constants";
import { EnabledLanguages } from "@framework/constants";
import { displayNameValidationSchema, emailValidationSchema } from "@gemunion/yup-rules";

import { urlValidationSchema } from "../../../../components/validation";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  displayName: displayNameValidationSchema,
  gender: string().oneOf(Object.values(EnabledGenders)),
  country: string().oneOf(Object.values(EnabledCountries)),
  language: string().oneOf(Object.values(EnabledLanguages)),
  imageUrl: urlValidationSchema,
});
