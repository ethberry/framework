import { object, string } from "yup";

import { dbIdValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  productId: dbIdValidationSchema,
  imageUrl: urlValidationSchema,
});
