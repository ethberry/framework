import * as Yup from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  owner: addressValidationSchema,
  erc721TemplateId: Yup.number().required("form.validations.valueMissing"),
});

export const validationSchema2 = Yup.object().shape({
  list: Yup.array().of(validationSchema),
});
