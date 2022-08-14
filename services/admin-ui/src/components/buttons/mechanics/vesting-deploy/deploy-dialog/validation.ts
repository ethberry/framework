import * as Yup from "yup";

import { reISO8601 } from "@gemunion/constants";

export const validationSchema = Yup.object().shape({
  account: Yup.string().required("form.validations.valueMissing"),
  startTimestamp: Yup.string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
