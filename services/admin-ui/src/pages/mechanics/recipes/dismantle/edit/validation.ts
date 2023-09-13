import { mixed, number, object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { ContractFeatures, DismantleStatus, DismantleStrategy, IAsset } from "@framework/types";

export const validationSchema = object().shape({
  item: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  dismantleStatus: mixed<DismantleStatus>()
    .oneOf(Object.values(DismantleStatus))
    .required("form.validations.valueMissing"),
  dismantleStrategy: mixed<DismantleStrategy>().when("price", {
    is: (price: IAsset) => price.components[0].contract?.contractFeatures.includes(ContractFeatures.RANDOM),
    then: () =>
      mixed<DismantleStrategy>().oneOf(Object.values(DismantleStrategy)).required("form.validations.valueMissing"),
  }),
  rarityMultiplier: number().when("dismantleStrategy", {
    is: (dismantleStrategy: DismantleStrategy) => dismantleStrategy === DismantleStrategy.EXPONENTIAL,
    then: () =>
      number()
        .required("form.validations.valueMissing")
        .integer("form.validations.badInput")
        .min(1, "form.validations.rangeUnderflow"),
  }),
});
