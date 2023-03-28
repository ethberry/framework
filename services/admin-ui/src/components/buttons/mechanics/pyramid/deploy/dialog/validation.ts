import { array, number, object } from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  shares: array().of(
    object().shape({
      payee: addressValidationSchema.test("isUnique", "form.validations.duplicate", (value, context) => {
        return context.from?.[1].value.shares?.filter(({ payee }: { payee: string }) => payee === value).length < 2;
      }),
      share: number()
        .typeError("form.validations.badInput")
        .min(1, "form.validations.rangeUnderflow")
        .required("form.validations.valueMissing"),
    }),
  ),
});
