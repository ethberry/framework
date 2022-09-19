import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  account: Yup.string().required("form.validations.valueMissing"),
  listId: Yup.number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
