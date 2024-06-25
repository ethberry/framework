import { number, object } from "yup";

import { draftValidationSchema, titleValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  reward: templateAssetValidationSchema,
  achievementLevel: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  achievementRuleId: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
  amount: number()
    .required("form.validations.valueMissing")
    .integer("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow"),
});
