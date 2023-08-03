import { number, object } from "yup";
import { dbIdValidationSchema } from "../../../../../../components/validation";

export const validationSchema = object().shape({
  parentId: dbIdValidationSchema,
  childId: dbIdValidationSchema,
  amount: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
