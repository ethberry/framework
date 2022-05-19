import * as Yup from "yup";

import { bigNumberValidationSchema, draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  amount: bigNumberValidationSchema,
  symbol: Yup.string().required("form.validations.valueMissing"),
});
