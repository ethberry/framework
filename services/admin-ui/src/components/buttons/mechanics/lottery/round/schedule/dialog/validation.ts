import { mixed, object } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { CronExpression } from "@framework/types";
// ggg
export const validationSchema = object().shape({
  schedule: mixed<CronExpression>().oneOf(Object.values(CronExpression)).required("form.validations.valueMissing"),
  description: draftValidationSchema,
});
