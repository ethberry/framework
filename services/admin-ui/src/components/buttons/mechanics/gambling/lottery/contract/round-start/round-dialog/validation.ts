import { number, object } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { addressValidationSchema } from "@ethberry/yup-rules-eth";
import { dbIdValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  contractId: dbIdValidationSchema,
  address: addressValidationSchema,
  ticket: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  maxTicket: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
});
