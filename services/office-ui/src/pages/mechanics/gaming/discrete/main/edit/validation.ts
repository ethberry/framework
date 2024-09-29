import { mixed, number, object, string } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import { dbIdValidationSchema } from "@ethberry/yup-rules";
import { DiscreteStatus, DiscreteStrategy } from "@framework/types";

export const validationSchema = object().shape({
  contractId: dbIdValidationSchema,
  attribute: string()
    .required("form.validations.valueMissing")
    .matches(/^[A-Z][A-Z0-9]*$/, "form.validations.patternMismatch")
    .max(32, "form.validations.rangeOverflow"),
  discreteStatus: mixed<DiscreteStatus>()
    .oneOf(Object.values(DiscreteStatus))
    .required("form.validations.valueMissing"),
  discreteStrategy: mixed<DiscreteStrategy>()
    .oneOf(Object.values(DiscreteStrategy))
    .required("form.validations.valueMissing"),
  growthRate: number().when("discreteStrategy", {
    is: (discreteStrategy: DiscreteStrategy) => discreteStrategy === DiscreteStrategy.EXPONENTIAL,
    then: () =>
      number()
        .required("form.validations.valueMissing")
        .integer("form.validations.badInput")
        .min(1, "form.validations.rangeUnderflow"),
  }),
  price: templateAssetValidationSchema,
});
