import { object } from "yup";

import { addressValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  account: addressValidationSchema,
});
