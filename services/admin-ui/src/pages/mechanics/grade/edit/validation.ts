import * as Yup from "yup";

import { assetValidationSchema } from "../../../../components/inputs/price-schema";

export const validationSchema = Yup.object().shape({
  growthRate: Yup.number().required("form.validations.valueMissing"),
  item: assetValidationSchema,
  price: assetValidationSchema,
});
