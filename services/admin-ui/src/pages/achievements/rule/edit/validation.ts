import { mixed, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { AchievementRuleStatus, ContractEventType } from "@framework/types";
import { reISO8601 } from "@gemunion/constants";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  achievementStatus: mixed<AchievementRuleStatus>()
    .oneOf(Object.values(AchievementRuleStatus))
    .required("form.validations.valueMissing"),
  eventType: mixed<ContractEventType>()
    .oneOf(Object.values(ContractEventType))
    .required("form.validations.valueMissing"),
  // contractId: dbIdValidationSchema,
  startTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
