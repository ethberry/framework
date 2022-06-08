import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  symbol: Yup.string().required("form.validations.valueMissing"),
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  address: Yup.number().required("form.validations.valueMissing"),
});
