import { mixed, object, string } from "yup";

import { draftValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { emailValidationSchema } from "@gemunion/yup-rules/dist/email";
import { MerchantStatus } from "@framework/types";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  email: emailValidationSchema,
  imageUrl: urlValidationSchema,
  merchantStatus: mixed<MerchantStatus>()
    .oneOf(Object.values(MerchantStatus))
    .required("form.validations.valueMissing"),
});
