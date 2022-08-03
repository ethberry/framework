import * as Yup from "yup";

import { assetValidationSchema } from "../../../../components/inputs/price/price-schema";

export const validationSchema = Yup.object().shape({
  item: assetValidationSchema,
  price: assetValidationSchema,
  // TODO add validation
});
