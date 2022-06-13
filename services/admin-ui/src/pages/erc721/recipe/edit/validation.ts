import * as Yup from "yup";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema2 = Yup.object().shape({
  amount: bigNumberValidationSchema.min(0, "form.validations.rangeUnderflow"),
  erc1155TokenId: Yup.mixed().defined().required("form.validations.valueMissing"),
});

export const validationSchema = Yup.object().shape({
  erc721DropboxId: Yup.mixed().defined().optional(),
  erc721TemplateId: Yup.mixed().defined().optional(),
  ingredients: Yup.array().of(validationSchema2),
});
