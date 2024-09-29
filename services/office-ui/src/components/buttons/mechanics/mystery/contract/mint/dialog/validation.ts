import { object } from "yup";

import { addressValidationSchema } from "@ethberry/yup-rules-eth";
import { dbIdValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  contractId: dbIdValidationSchema,
  mysteryId: dbIdValidationSchema,
});
