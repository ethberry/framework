import * as Yup from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("form.validations.valueMissing"),
  symbol: Yup.string().required("form.validations.valueMissing").max(32, "form.validations.rangeUnderflow"),
  cap: bigNumberValidationSchema,
});
