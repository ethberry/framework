import { mixed, object, string } from "yup";

import { draftValidationSchema, titleValidationSchema } from "@ethberry/yup-rules";
import { AchievementRuleStatus } from "@framework/types";
import { reISO8601 } from "@ethberry/constants";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  achievementStatus: mixed<AchievementRuleStatus>()
    .oneOf(Object.values(AchievementRuleStatus))
    .required("form.validations.valueMissing"),
  // eventType: mixed<ContractEventType>()
  //   .oneOf(Object.values(ContractEventType))
  //   .required("form.validations.valueMissing"),
  eventType: string().required("form.validations.valueMissing"),
  // contractId: dbIdValidationSchema,
  startTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
