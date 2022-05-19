import * as Yup from "yup";
import { draftValidationSchema } from "@gemunion/yup-rules";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  price: Yup.string().required("form.validations.valueMissing"),
  erc721TemplateId: Yup.mixed().defined().required("form.validations.valueMissing"),
  erc721CollectionId: Yup.mixed().defined().required("form.validations.valueMissing"),
  imageUrl: Yup.string().required("form.validations.valueMissing"),
});
