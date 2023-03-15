import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  userId: Yup.number().required("form.validations.valueMissing"),
});
