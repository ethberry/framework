import { boolean, object, string } from "yup";

import { dbIdValidationSchema, draftValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  item: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
  isPrivate: boolean(),
});
