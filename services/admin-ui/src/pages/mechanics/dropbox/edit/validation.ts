import * as Yup from "yup";
import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  price: Yup.string().required("form.validations.valueMissing"),
  item: Yup.string().required("form.validations.valueMissing"),
  templateIds: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  contractId: Yup.mixed().defined("form.validations.valueMissing").required("form.validations.valueMissing"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
