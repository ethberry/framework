import { array, object } from "yup";

export const validationSchema = object().shape({
  tokenIds: array().test("isUnique", "form.validations.duplicate", (value = []) => {
    return value.length === [...new Set(value)].length;
  }),
});
