import { object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { dbIdValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  contractId: dbIdValidationSchema,
  price: templateAssetValidationSchema,
});
