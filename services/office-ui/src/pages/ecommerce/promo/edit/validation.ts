import { object, string } from "yup";
import { dbIdValidationSchema } from "../../../../components/validation";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  productId: dbIdValidationSchema,
  imageUrl: string().required("form.validations.valueMissing"),
});
