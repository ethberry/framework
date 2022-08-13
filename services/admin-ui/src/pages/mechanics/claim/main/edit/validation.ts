import * as Yup from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

import { assetValidationSchema } from "../../../../../components/inputs/price/price-schema";

export const validationSchema = Yup.object().shape({
  account: addressValidationSchema,
  item: assetValidationSchema,
});
