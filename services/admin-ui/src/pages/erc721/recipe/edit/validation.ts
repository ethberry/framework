import * as Yup from "yup";

export const validationSchema2 = Yup.object().shape({
  amount: Yup.number().min(0, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  erc1155TokenId: Yup.mixed().defined().required("form.validations.valueMissing"),
});

export const validationSchema = Yup.object().shape({
  erc721DropboxId: Yup.mixed().defined().optional(),
  erc721TemplateId: Yup.mixed().defined().optional(),
  ingredients: Yup.array().of(validationSchema2),
});
