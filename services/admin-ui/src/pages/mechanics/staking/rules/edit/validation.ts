import { mixed, object, string } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { dbIdValidationSchema, draftValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { StakingRuleStatus } from "@framework/types";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  imageUrl: urlValidationSchema,
  description: draftValidationSchema,
  stakingRuleStatus: mixed<StakingRuleStatus>()
    .oneOf(Object.values(StakingRuleStatus))
    .required("form.validations.valueMissing"),
  // deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
});
