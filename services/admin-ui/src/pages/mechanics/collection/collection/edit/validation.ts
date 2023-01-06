import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  // description: draftValidationSchema,
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
