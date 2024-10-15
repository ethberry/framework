import { mixed, object } from "yup";

import { CronExpression } from "@framework/types";

export const validationSchema = object().shape({
  schedule: mixed<CronExpression>().oneOf(Object.values(CronExpression)).required("form.validations.valueMissing"),
});
