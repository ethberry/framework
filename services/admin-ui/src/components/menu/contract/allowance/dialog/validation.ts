import { object, string } from "yup";

import { tokenAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  token: tokenAssetValidationSchema,
  address: string().required("form.validations.valueMissing"),
});
