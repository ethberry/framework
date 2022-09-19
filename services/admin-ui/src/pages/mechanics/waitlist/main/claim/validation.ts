import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  // TODO must be eth address
  account: Yup.string().required("form.validations.valueMissing"),
  listId: Yup.number().min(1, "form.validations.valueMissing").required("form.validations.valueMissing"),
});
