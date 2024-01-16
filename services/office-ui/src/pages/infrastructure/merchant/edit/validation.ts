import { mixed, object, string } from "yup";

import { draftValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { emailValidationSchema } from "@gemunion/yup-rules/dist/email";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

import { MerchantStatus, RatePlanType } from "@framework/types";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  email: emailValidationSchema,
  wallet: addressValidationSchema,
  imageUrl: urlValidationSchema,
  merchantStatus: mixed<MerchantStatus>()
    .oneOf(Object.values(MerchantStatus))
    .required("form.validations.valueMissing"),
  ratePlan: mixed<RatePlanType>().oneOf(Object.values(RatePlanType)).required("form.validations.valueMissing"),
});
