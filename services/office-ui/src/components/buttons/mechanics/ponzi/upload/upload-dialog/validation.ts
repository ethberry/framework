import { object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { dbIdValidationSchema } from "@gemunion/yup-rules";

// TODO add more validation
export const validationSchema = object().shape({
  deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
});
