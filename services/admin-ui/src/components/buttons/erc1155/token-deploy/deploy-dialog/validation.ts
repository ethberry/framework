import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  baseTokenURI: Yup.string().required("form.validations.valueMissing"),
});
