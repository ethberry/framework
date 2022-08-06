import * as Yup from "yup";

import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  contractId: Yup.string().required("form.validations.valueMissing"),
  address: Yup.string().required("form.validations.valueMissing"),
  amount: bigNumberValidationSchema,
});
