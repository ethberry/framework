import { object } from "yup";

import { tokenAssetValidationSchema } from "@ethberry/mui-inputs-asset";

export const validationSchema = object().shape({
  item: tokenAssetValidationSchema,
});
