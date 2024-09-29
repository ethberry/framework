import { number, object } from "yup";

import { dbIdValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  parentId: dbIdValidationSchema,
  childId: dbIdValidationSchema,
  amount: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
