import { object } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { dbIdValidationSchema, titleValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  contractId: dbIdValidationSchema,
  price: templateAssetValidationSchema,
});
