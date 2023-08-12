import { object, string } from "yup";

import { draftValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  imageUrl: urlValidationSchema,
});
