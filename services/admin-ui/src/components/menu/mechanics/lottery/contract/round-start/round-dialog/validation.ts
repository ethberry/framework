import { number, object } from "yup";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

// TODO validations
export const validationSchema = object().shape({
  address: addressValidationSchema,
  ticket: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  maxTicket: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
});
