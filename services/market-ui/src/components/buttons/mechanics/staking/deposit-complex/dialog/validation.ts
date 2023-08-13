import { object } from "yup";

import { dbIdValidationSchema } from "@gemunion/yup-rules";

// TODO validate array tokenIds
export const validationSchema = object().shape({
  tokenId: dbIdValidationSchema,
});
