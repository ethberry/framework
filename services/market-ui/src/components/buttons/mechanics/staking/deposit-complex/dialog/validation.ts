import { object } from "yup";

import { dbIdValidationSchema } from "../../../../../validation";

// TODO validate array tokenIds
export const validationSchema = object().shape({
  tokenId: dbIdValidationSchema,
});
