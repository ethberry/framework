import { ReferralProgramStatus } from "@framework/types";
import { mixed, object } from "yup";

export const validationSchemaStatus = object().shape({
  referralProgramStatus: mixed<ReferralProgramStatus>()
    .oneOf(Object.values(ReferralProgramStatus))
    .required("form.validations.valueMissing"),
});
