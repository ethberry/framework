import { number, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const editValidationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
});

export const createValidationSchema = object().shape({
  symbol: string().required("form.validations.valueMissing").max(32, "form.validations.tooLong"),
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  address: string().required("form.validations.valueMissing"),
  decimals: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .max(32, "form.validations.rangeOverflow"),
});
