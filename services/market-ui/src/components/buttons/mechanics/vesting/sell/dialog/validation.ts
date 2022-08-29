import * as Yup from "yup";

import { assetValidationSchema } from "../../../../../inputs/price/price-schema";

export const validationSchema = Yup.object().shape({
  account: Yup.string().required("form.validations.valueMissing"),
  price: assetValidationSchema,
});
