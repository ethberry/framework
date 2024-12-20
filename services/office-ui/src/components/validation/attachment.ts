import { object, string } from "yup";
import { titleValidationSchema } from "@gemunion/yup-rules";

export const attachmentValidationSchema = object().shape({
  title: titleValidationSchema,
  url: string().required("form.validations.valueMissing"),
});
