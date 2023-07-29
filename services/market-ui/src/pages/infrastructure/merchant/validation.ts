import { object, string } from "yup";

import { draftValidationSchema, emailValidationSchema } from "@gemunion/yup-rules";

import { urlValidationSchema } from "../../../components/validation";

export const validationSchema = object().shape({
  email: emailValidationSchema,
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
});
