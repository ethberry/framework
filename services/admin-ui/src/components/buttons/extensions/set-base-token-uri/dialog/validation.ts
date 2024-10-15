import { object } from "yup";

import { urlValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  baseTokenURI: urlValidationSchema,
});
