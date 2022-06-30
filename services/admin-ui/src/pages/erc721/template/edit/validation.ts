import * as Yup from "yup";

import { draftValidationSchema, jsonValidationSchema } from "@gemunion/yup-rules";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  attributes: jsonValidationSchema,
  price: Yup.string().required("form.validations.valueMissing"),
  amount: bigNumberValidationSchema,
  contractId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
