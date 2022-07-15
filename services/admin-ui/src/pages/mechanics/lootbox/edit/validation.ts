import * as Yup from "yup";
import { draftValidationSchema } from "@gemunion/yup-rules";

import { assetValidationSchema } from "../../../../components/inputs/price-schema";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  item: assetValidationSchema,
  price: assetValidationSchema,
  templateIds: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  contractId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
