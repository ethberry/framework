import { string } from "yup";

export const urlValidationSchema = string().required("form.validations.valueMissing");
