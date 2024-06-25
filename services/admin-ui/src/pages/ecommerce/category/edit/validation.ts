import { titleValidationSchema } from "@gemunion/yup-rules";
import { object, string } from "yup";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: string().required("form.validations.valueMissing"),
});
