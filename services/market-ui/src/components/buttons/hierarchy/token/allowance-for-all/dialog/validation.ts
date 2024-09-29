import { object } from "yup";

import { addressValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  contract: object().shape({ address: addressValidationSchema.required("form.validations.valueMissing") }),
});
