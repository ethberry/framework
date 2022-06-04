import * as Yup from "yup";

export const validationSchema2 = Yup.object().shape({
  amount: Yup.string().required("form.validations.valueMissing"),
  erc1155TokenId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
});

export const validationSchema = Yup.object().shape({
  erc1155TokenId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  ingredients: Yup.array().of(validationSchema2),
});
