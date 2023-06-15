import { object, string } from "yup";

import { reEthAddress } from "@gemunion/constants";

export const validationSchema = object().shape({
  account: string().matches(reEthAddress, "form.validations.patternMismatch").required("form.validations.valueMissing"),
});
