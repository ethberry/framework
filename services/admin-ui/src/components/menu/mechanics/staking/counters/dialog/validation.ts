import { number, object } from "yup";

// TODO do validation RuleId and wallet instead
export const validationSchema = object().shape({
  maxStake: number()
    .typeError("form.validations.badInput")
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .max(10000, "form.validations.rangeOverflow")
    .min(0, "form.validations.rangeUnderflow"),
});
