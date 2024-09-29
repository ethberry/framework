import { object } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { draftValidationSchema, titleValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  price: templateAssetValidationSchema,
});
