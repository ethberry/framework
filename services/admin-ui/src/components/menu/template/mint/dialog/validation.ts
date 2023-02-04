import * as Yup from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = Yup.object().shape({
  account: addressValidationSchema,
  template: templateAssetValidationSchema,
});
