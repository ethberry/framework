import * as Yup from "yup";

import { addressValidationSchema } from "@gemunion/yup-rules-eth";
import { reISO8601 } from "@gemunion/constants";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = Yup.object().shape({
  account: addressValidationSchema,
  item: templateAssetValidationSchema,
  endTimestamp: Yup.string()
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
