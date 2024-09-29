import { object } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";

export const validationSchema = object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
});
