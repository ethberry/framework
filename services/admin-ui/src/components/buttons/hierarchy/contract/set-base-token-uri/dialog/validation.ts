import { object } from "yup";

import { urlValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  baseTokenURI: urlValidationSchema,
});
