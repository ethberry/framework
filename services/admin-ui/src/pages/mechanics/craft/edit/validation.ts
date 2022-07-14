import * as Yup from "yup";

import { assetValidationSchema } from "../../../../components/inputs/price-schema";

export const validationSchema = Yup.object().shape({
  item: assetValidationSchema,
  ingredients: assetValidationSchema,
});
