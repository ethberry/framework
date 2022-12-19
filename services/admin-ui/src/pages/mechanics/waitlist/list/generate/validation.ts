import * as Yup from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = Yup.object().shape({
  item: templateAssetValidationSchema,
});
