import * as Yup from "yup";

import { jsonValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  attributes: jsonValidationSchema,
});
