import * as Yup from "yup";

export const validationSchema2 = Yup.object().shape({
  amount: Yup.number().min(0).required("form.validations.valueMissing"),
  erc1155TokenId: Yup.mixed().defined().required("form.validations.valueMissing"),
});

export const validationSchema = Yup.object().shape({
  erc1155TokenId: Yup.mixed().defined().required(),
  ingredients: Yup.array().of(validationSchema2),
});
