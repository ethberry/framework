import { mixed, object } from "yup";

import { titleValidationSchema } from "@ethberry/yup-rules";
import { ContractStatus } from "@framework/types";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  contractStatus: mixed<ContractStatus>()
    .oneOf(Object.values(ContractStatus))
    .required("form.validations.valueMissing"),
});
