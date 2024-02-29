import { mixed, number, object, string } from "yup";

import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";
import { dbIdValidationSchema } from "@gemunion/yup-rules";
import { GradeStatus, GradeStrategy } from "@framework/types";

export const validationSchema = object().shape({
  contractId: dbIdValidationSchema,
  attribute: string()
    .required("form.validations.valueMissing")
    .matches(/^[A-Z][A-Z0-9]*$/, "form.validations.patternMismatch")
    .max(32, "form.validations.rangeOverflow"),
  gradeStatus: mixed<GradeStatus>().oneOf(Object.values(GradeStatus)).required("form.validations.valueMissing"),
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
