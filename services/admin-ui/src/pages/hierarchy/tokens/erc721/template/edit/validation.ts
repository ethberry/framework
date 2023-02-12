import * as Yup from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  price: templateAssetValidationSchema,
  amount: bigNumberValidationSchema,
  contractId: Yup.number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
