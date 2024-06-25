import { object } from "yup";
import { titleValidationSchema } from "@gemunion/yup-rules";

// import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  // description: draftValidationSchema,
});
