import { number, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  imageUrl: string().required("form.validations.valueMissing"),
  merchantId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
