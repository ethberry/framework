import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { CronExpression } from "@framework/types";
// ggg
export const validationSchema = Yup.object().shape({
  schedule: Yup.mixed<CronExpression>()
    .oneOf(Object.values(CronExpression))
    .required("form.validations.valueMissing"),
  description: draftValidationSchema,
});
