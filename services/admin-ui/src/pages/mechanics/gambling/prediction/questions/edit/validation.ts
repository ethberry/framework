import { object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { draftValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  price: templateAssetValidationSchema,
});
