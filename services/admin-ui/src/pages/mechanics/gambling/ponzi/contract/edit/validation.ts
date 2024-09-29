import { object } from "yup";
import { titleValidationSchema } from "@ethberry/yup-rules";

// import { draftValidationSchema } from "@ethberry/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  // description: draftValidationSchema,
});
