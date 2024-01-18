import { object, string } from "yup";

import { EnabledLanguages } from "@framework/constants";
import { EnabledCountries, EnabledGenders } from "@gemunion/constants";
import { displayNameValidationSchema, emailValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  displayName: displayNameValidationSchema,
  gender: string().oneOf(Object.values(EnabledGenders)).required("form.validations.valueMissing"),
  country: string().oneOf(Object.values(EnabledCountries)).required("form.validations.valueMissing"),
  language: string().oneOf(Object.values(EnabledLanguages)).required("form.validations.valueMissing"),
  imageUrl: urlValidationSchema,
});
