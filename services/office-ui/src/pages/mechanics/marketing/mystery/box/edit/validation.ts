import { object } from "yup";

import { draftValidationSchema, titleValidationSchema, urlValidationSchema } from "@ethberry/yup-rules";
import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  content: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  imageUrl: urlValidationSchema,
});
