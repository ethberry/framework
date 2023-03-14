import { number, object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  price: templateAssetValidationSchema,
  amount: bigNumberValidationSchema,
  contractId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  imageUrl: string().required("form.validations.valueMissing"),
});
