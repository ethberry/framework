import { object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  price: templateAssetValidationSchema,
});
