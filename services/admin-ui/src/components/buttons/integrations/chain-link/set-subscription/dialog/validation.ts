import { object } from "yup";

import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  vrfSubId: bigNumberValidationSchema
    .required("form.validations.valueMissing")
    .min(1, "form.validations.rangeUnderflow"),
});
