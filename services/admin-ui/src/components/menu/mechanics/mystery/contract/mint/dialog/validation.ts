import { object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

import { dbIdValidationSchema } from "../../../../../../validation";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  contractId: dbIdValidationSchema,
  mysteryId: dbIdValidationSchema,
});
