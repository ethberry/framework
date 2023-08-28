import { object, string } from "yup";

import { dbIdValidationSchema, draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  symbol: string().required("form.validations.valueMissing").max(32, "form.validations.tooLong"),
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  merchantId: dbIdValidationSchema,
});
