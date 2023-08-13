import { object } from "yup";

import { dbIdValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  userId: dbIdValidationSchema,
  addressId: dbIdValidationSchema,
});
