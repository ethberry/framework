import { object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { urlValidationSchema } from "../../../../../components/validation";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  imageUrl: urlValidationSchema,
});