import { object } from "yup";

import { dbIdValidationSchema } from "../../../../components/validation";

export const validationSchema = object().shape({
  userId: dbIdValidationSchema,
  addressId: dbIdValidationSchema,
});
