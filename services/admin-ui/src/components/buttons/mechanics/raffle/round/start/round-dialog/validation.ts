import { object } from "yup";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

// TODO validations
export const validationSchema = object().shape({
  address: templateAssetValidationSchema,
  maxTicket: templateAssetValidationSchema,
  items: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
});
