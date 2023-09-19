import { object, string } from "yup";

import { draftValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  address: addressValidationSchema,
  imageUrl: urlValidationSchema,
});
