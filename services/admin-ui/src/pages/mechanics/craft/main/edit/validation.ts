import { boolean, object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  inverse: boolean(),
});
