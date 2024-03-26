import { object } from "yup";

import { draftValidationSchema, titleValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  imageUrl: urlValidationSchema,
});
