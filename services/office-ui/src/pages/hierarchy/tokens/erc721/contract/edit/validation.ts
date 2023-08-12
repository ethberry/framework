import { object, string } from "yup";

import { dbIdValidationSchema, draftValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  symbol: string().required("form.validations.valueMissing").max(32, "form.validations.tooLong"),
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  address: addressValidationSchema,
  imageUrl: urlValidationSchema,
  merchantId: dbIdValidationSchema,
});
