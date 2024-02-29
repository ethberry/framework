import { object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { dbIdValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  listId: dbIdValidationSchema,
});
