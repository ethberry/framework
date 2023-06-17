import { object, string } from "yup";

import { EnabledCountries } from "@gemunion/constants";

export const addressValidationSchema = object().shape({
  addressLine1: string().required("form.validations.valueMissing"),
  addressLine2: string(),
  city: string().required("form.validations.valueMissing"),
  country: string().oneOf(Object.values(EnabledCountries)).required("form.validations.valueMissing"),
  state: string(),
  zip: string().required("form.validations.valueMissing"),
});
