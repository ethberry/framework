import * as Yup from "yup";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema2 = Yup.object().shape({
  amount: bigNumberValidationSchema.min(0, "form.validations.rangeUnderflow"),
  erc1155TokenId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
});

export const validationSchema = Yup.object().shape({
  erc1155TokenId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  ingredients: Yup.array()
    .required("form.validations.valueMissing")
    .min(1, "form.validations.rangeUnderflow")
    .of(validationSchema2),
});
