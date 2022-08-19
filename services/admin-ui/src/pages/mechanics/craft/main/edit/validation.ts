import * as Yup from "yup";

import { reISO8601 } from "@gemunion/constants";

import { assetValidationSchema } from "../../../../../components/inputs/price/price-schema";

export const validationSchema = Yup.object().shape({
  item: assetValidationSchema,
  price: assetValidationSchema,
  startTimestamp: Yup.string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
  endTimestamp: Yup.string()
    .matches(reISO8601, "form.validations.patternMismatch")
    .required("form.validations.valueMissing"),
});
