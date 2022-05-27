import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  amount: bigNumberValidationSchema,
  symbol: Yup.string().required("form.validations.valueMissing"),
});
