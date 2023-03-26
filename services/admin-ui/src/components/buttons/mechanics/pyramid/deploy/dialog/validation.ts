import { array, mixed, number, object, string } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  shares: array().of(
    object().shape({
      payee: addressValidationSchema.test("isUnique", "form.validations.duplicate", (value, context) => {
        // @TODO beautify it
        return context.from?.[1].value.shares?.filter(({ payee }: { payee: string }) => payee === value).length < 2;
      }),
      share: mixed().when({
        is: (value: number | string) => typeof value === "string",
        then: () => string().required("form.validations.valueMissing"),
        otherwise: () => number().min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
      }),
    }),
  ),
});
