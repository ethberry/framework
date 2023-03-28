import { mixed, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { StakingRuleStatus } from "@framework/types";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  stakingRuleStatus: mixed<StakingRuleStatus>()
    .oneOf(Object.values(StakingRuleStatus))
    .required("form.validations.valueMissing"),
});
