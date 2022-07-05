import * as Yup from "yup";

import { draftValidationSchema, jsonValidationSchema } from "@gemunion/yup-rules";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

import { assetValidationSchema } from "../../../../components/inputs/price-schema";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  attributes: jsonValidationSchema,
  price: assetValidationSchema,
  amount: bigNumberValidationSchema,
  contractId: Yup.number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
