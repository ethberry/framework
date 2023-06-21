import { number, object } from "yup";

export const validationSchema = object().shape({
  timeLagBeforeRelease: number().required("form.validations.valueMissing"),
  commission: number().required("form.validations.valueMissing"),
});
