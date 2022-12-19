import * as Yup from "yup";

import { tokenAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = Yup.object().shape({
  token: tokenAssetValidationSchema,
  address: Yup.string().required("form.validations.valueMissing"),
});
