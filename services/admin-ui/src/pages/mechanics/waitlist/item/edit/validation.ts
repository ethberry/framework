import * as Yup from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  account: addressValidationSchema,
  listId: Yup.number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
