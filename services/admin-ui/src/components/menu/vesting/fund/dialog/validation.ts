import { object } from "yup";

import { tokenAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  token: tokenAssetValidationSchema,
  address: addressValidationSchema,
});
