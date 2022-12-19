import * as Yup from "yup";

import { tokenAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = Yup.object().shape({
  item: tokenAssetValidationSchema,
});
