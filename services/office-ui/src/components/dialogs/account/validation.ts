import { object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  account: addressValidationSchema,
});
