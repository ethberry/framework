import { object } from "yup";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  vrfSubId: bigNumberValidationSchema
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .min(0, "form.validations.rangeUnderflow"),
});
