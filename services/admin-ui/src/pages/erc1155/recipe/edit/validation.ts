import * as Yup from "yup";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema2 = Yup.object().shape({
  amount: bigNumberValidationSchema,
  erc1155TokenId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
});

export const validationSchema = Yup.object().shape({
  erc1155TokenId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  ingredients: Yup.array().of(validationSchema2),
});
