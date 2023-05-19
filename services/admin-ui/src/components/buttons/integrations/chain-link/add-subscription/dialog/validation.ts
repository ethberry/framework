import { object, string } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  subscriptionId: string().required("form.validations.valueMissing"),
  address: addressValidationSchema,
});
