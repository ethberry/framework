import { object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { urlValidationSchema } from "../../../../../components/validation";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  imageUrl: urlValidationSchema,
});
