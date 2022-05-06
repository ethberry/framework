import * as Yup from "yup";

import { emailValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  email: emailValidationSchema,
});
