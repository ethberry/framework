import { object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

import { dbIdValidationSchema } from "../../../../../validation";

// TODO add more validation
export const validationSchema = object().shape({
  deposit: templateAssetValidationSchema,
  reward: templateAssetValidationSchema,
  content: templateAssetValidationSchema,
  contractId: dbIdValidationSchema,
});
