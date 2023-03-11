import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const editValidationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
});

export const createValidationSchema = Yup.object().shape({
  symbol: Yup.string().required("form.validations.valueMissing").max(32, "form.validations.tooLong"),
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  address: Yup.string().required("form.validations.valueMissing"),
  decimals: Yup.number().required("form.validations.valueMissing").max(32, "form.validations.rangeOverflow"),
});
