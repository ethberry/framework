import { object, string } from "yup";

import { addressValidationSchema } from "@ethberry/yup-rules-eth";
import { reISO8601 } from "@ethberry/constants";
import { tokenAssetValidationSchema } from "@ethberry/mui-inputs-asset";

export const validationSchema = object().shape({
  account: addressValidationSchema,
  item: tokenAssetValidationSchema,
  endTimestamp: string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing")
    .test("is-valid", "form.validations.rangeUnderflow", (value: string | undefined) => {
      if (!value) {
        return false;
      }
      if (value === new Date(0).toISOString()) {
        return true;
      }
      return new Date(value).getTime() > new Date().getTime();
    }),
});
