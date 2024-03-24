import { mixed, object } from "yup";

import { PredictionQuestionResult } from "@framework/types";

export const validationSchema = object().shape({
  questionResult: mixed<PredictionQuestionResult>()
    .oneOf(Object.values(PredictionQuestionResult))
    .required("form.validations.valueMissing"),
});
