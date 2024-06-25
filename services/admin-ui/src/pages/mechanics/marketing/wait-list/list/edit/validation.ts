import { boolean, object } from "yup";

import { dbIdValidationSchema, draftValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  isPrivate: boolean(),
  item: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
});
