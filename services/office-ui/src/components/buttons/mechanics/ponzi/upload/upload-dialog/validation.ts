import { object } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { dbIdValidationSchema } from "@ethberry/yup-rules";

// TODO add more validation
export const validationSchema = object().shape({
  deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
});
