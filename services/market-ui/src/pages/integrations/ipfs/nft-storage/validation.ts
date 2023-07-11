import { object } from "yup";

import { dbIdValidationSchema } from "../../../../components/validation";

export const validationSchema = object().shape({
  contractId: dbIdValidationSchema,
  tokenId: dbIdValidationSchema,
});
