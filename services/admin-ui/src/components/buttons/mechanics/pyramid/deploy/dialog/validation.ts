import { array, mixed, number, object, string } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  shares: array().of(
    object().shape({
      payee: addressValidationSchema,
      share: mixed().when({
        is: (value: number | string) => typeof value === "string",
        then: () => string().required("form.validations.valueMissing"),
        otherwise: () => number().min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
      }),
    }),
  ),
});
