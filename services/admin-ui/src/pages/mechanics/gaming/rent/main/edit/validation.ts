import { object, string } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { dbIdValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  contractId: dbIdValidationSchema,
  price: templateAssetValidationSchema,
});
