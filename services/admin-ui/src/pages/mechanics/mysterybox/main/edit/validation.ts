import * as Yup from "yup";
import { draftValidationSchema } from "@gemunion/yup-rules";

import { assetValidationSchema } from "../../../../../components/inputs/price/price-schema";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  item: assetValidationSchema,
  price: assetValidationSchema,
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
