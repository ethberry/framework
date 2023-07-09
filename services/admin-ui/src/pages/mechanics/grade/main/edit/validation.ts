import { mixed, number, object, string } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { GradeStrategy } from "@framework/types";
import { dbIdValidationSchema } from "../../../../../components/validation";

export const validationSchema = object().shape({
  contractId: dbIdValidationSchema,
  attribute: string()
    .required("form.validations.valueMissing")
    .matches(/^[0-9A-Z]+$/, "form.validations.patternMismatch")
    .max(32, "form.validations.rangeOverflow"),
  // gradeStatus: mixed<GradeStatus>().oneOf(Object.values(GradeStatus)).required("form.validations.valueMissing"),
  gradeStrategy: mixed<GradeStrategy>().oneOf(Object.values(GradeStrategy)).required("form.validations.valueMissing"),
  growthRate: number().when("gradeStrategy", {
    is: (gradeStrategy: GradeStrategy) => gradeStrategy === GradeStrategy.EXPONENTIAL,
    then: () =>
      number()
        .required("form.validations.valueMissing")
        .integer("form.validations.badInput")
        .min(1, "form.validations.rangeUnderflow"),
  }),
  price: templateAssetValidationSchema,
});
