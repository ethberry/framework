import { object } from "yup";

import { dbIdValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  userId: dbIdValidationSchema,
  addressId: dbIdValidationSchema,
});
