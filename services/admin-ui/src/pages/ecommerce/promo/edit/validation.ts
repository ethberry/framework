import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  productId: Yup.number().required("form.validations.valueMissing"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
