import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  price: templateAssetValidationSchema,
});
