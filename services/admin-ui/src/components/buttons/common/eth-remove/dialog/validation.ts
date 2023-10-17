import { mixed, number, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { ListenerType } from "@framework/types";

export const validationSchema = object().shape({
  address: addressValidationSchema,
  listenerType: mixed<ListenerType>().oneOf(Object.values(ListenerType)).required("form.validations.valueMissing"),
  chainId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
