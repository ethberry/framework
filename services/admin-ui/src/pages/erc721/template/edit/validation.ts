import * as Yup from "yup";

import { draftValidationSchema, jsonValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  attributes: jsonValidationSchema,
  price: Yup.string().required("form.validations.valueMissing"),
  amount: Yup.number().min(0, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  erc721CollectionId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
