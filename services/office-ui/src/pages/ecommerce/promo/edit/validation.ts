import { number, object, string } from "yup";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  productId: number().required("form.validations.valueMissing"),
  imageUrl: string().required("form.validations.valueMissing"),
});
