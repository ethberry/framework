import * as Yup from "yup";

import { emailValidationSchema, phoneNumberValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: Yup.string().required("form.validations.valueMissing"),
  email: emailValidationSchema,
  phoneNumber: phoneNumberValidationSchema,
});
