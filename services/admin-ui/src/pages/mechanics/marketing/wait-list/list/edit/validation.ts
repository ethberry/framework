import { boolean, object } from "yup";

import { dbIdValidationSchema, draftValidationSchema, titleValidationSchema } from "@ethberry/yup-rules";
import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  isPrivate: boolean(),
  item: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
});
