import { object, array, number } from "yup";

export const validationSchema = object().shape({
  tokenIds: array().of(number().typeError("form.validations.badInput").required("form.validations.valueMissing")),
});
