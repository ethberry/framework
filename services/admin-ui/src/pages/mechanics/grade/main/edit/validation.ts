import * as Yup from "yup";

import { GradeStrategy } from "@framework/types";

import { assetValidationSchema } from "../../../../../components/inputs/price/price-schema";

export const validationSchema = Yup.object().shape({
  growthRate: Yup.number().when("gradeStrategy", {
    is: (gradeStrategy: GradeStrategy) => gradeStrategy === GradeStrategy.EXPONENTIAL,
    then: Yup.number().required("form.validations.valueMissing"),
  }),
  price: assetValidationSchema,
});
