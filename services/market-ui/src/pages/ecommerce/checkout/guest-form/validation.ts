import { array, boolean, object, string } from "yup";

import { addressValidationSchema } from "../../../../components/validation";
import { userWithoutPasswordValidationSchema, userWithPasswordValidationSchema } from "./user-input/validation";

export const validationSchema = object().shape({
  user: object().when("save", {
    is: true,
    then: () => userWithPasswordValidationSchema,
    otherwise: () => userWithoutPasswordValidationSchema,
  }),
  addresses: array().of(addressValidationSchema).required("form.validations.valueMissing"),
  captcha: string().required("form.validations.valueMissing"),
  save: boolean(),
});
