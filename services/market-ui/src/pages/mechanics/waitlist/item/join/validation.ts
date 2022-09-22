import * as Yup from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  account: addressValidationSchema,
  listId: Yup.number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
});
