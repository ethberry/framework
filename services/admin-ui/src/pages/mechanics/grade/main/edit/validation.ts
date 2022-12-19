import * as Yup from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { GradeStrategy } from "@framework/types";

export const validationSchema = Yup.object().shape({
  growthRate: Yup.number().when("gradeStrategy", {
    is: (gradeStrategy: GradeStrategy) => gradeStrategy === GradeStrategy.EXPONENTIAL,
    then: Yup.number().required("form.validations.valueMissing"),
  }),
  price: templateAssetValidationSchema,
});
