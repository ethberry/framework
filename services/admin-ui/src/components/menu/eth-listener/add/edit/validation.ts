import * as Yup from "yup";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { ListenerType } from "./index";

export const validationSchema = Yup.object().shape({
  address: addressValidationSchema,
  listenerType: Yup.mixed<ListenerType>().oneOf(Object.values(ListenerType)).required("form.validations.valueMissing"),
  fromBlock: Yup.number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
