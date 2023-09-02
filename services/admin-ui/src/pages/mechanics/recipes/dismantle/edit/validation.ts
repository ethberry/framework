import { mixed, number, object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { DismantleStatus } from "@framework/types";

export const validationSchemaCreate = object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  rarityMultiplier: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
});

export const validationSchemaEdit = object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  dismantleStatus: mixed<DismantleStatus>()
    .oneOf(Object.values(DismantleStatus))
    .required("form.validations.valueMissing"),
  rarityMultiplier: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(0, "form.validations.rangeUnderflow"),
});
