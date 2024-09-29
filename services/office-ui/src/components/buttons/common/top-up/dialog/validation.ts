import { object } from "yup";

import { tokenAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { addressValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  token: tokenAssetValidationSchema,
  address: addressValidationSchema,
});
