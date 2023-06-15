import { object, string } from "yup";

import { reEthAddress } from "@gemunion/constants";

export const validationSchema = object().shape({
  address: string().matches(reEthAddress, "form.validations.patternMismatch").required("form.validations.valueMissing"),
});
