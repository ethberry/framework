import { object, mixed, number, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  achievementType: mixed<AchievementType>()
    .oneOf(Object.values(AchievementType))
    .required("form.validations.valueMissing"),
  achievementStatus: mixed<AchievementRuleStatus>()
    .oneOf(Object.values(AchievementRuleStatus))
    .required("form.validations.valueMissing"),
  eventType: mixed<ContractEventType>()
    .oneOf(Object.values(ContractEventType))
    .required("form.validations.valueMissing"),
  contractId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
