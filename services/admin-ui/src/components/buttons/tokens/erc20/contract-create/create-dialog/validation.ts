import { number, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  symbol: string().required("form.validations.valueMissing").max(32, "form.validations.tooLong"),
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  address: string().required("form.validations.valueMissing"),
  decimals: number().required("form.validations.valueMissing").max(32, "form.validations.rangeOverflow"),
});
