import { mixed, object } from "yup";

import { PonziContractTemplates } from "@framework/types";

export const validationSchema = object().shape({
  contractTemplate: mixed<PonziContractTemplates>()
    .oneOf(Object.values(PonziContractTemplates))
    .required("form.validations.valueMissing"),
});
