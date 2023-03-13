import { number, object } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { GradeStrategy } from "@framework/types";

export const validationSchema = () =>
  object().shape({
    growthRate: number().when("gradeStrategy", {
      is: (gradeStrategy: GradeStrategy) => gradeStrategy === GradeStrategy.EXPONENTIAL,
      then: () => number().required("form.validations.valueMissing"),
    }),
    price: templateAssetValidationSchema,
  });
