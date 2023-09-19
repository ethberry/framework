import { mixed, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { ListenerType } from "@framework/types";

export const validationSchema = object().shape({
  address: addressValidationSchema,
  listenerType: mixed<ListenerType>().oneOf(Object.values(ListenerType)).required("form.validations.valueMissing"),
});
