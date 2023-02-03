import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  text: Yup.string().required("form.validations.valueMissing").min(100, "form.validations.rangeUnderflow"),
});
