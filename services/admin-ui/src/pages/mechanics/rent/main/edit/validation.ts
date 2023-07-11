import { object, string } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { dbIdValidationSchema } from "../../../../../components/validation";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  contractId: dbIdValidationSchema,
  price: templateAssetValidationSchema,
});
