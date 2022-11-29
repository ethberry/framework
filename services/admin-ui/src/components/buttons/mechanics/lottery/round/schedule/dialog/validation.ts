import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { CronExpression } from "../../../../../../common/interfaces";

export const validationSchema = Yup.object().shape({
  roundSchedule: Yup.mixed<CronExpression>()
    .oneOf(Object.values(CronExpression))
    .required("form.validations.valueMissing"),
  description: draftValidationSchema,
});
