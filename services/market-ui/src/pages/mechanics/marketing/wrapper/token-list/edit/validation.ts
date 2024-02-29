import { object } from "yup";

import { tokenAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  item: tokenAssetValidationSchema,
});
