import { mixed, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { AccessControlRoleType } from "@framework/types";

export const validationSchema = object().shape({
  role: mixed<AccessControlRoleType>()
    .oneOf(Object.values(AccessControlRoleType))
    .required("form.validations.valueMissing"),
  address: addressValidationSchema,
});
