import { number, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  listId: number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
});
