import { mixed, object } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

import { CronExpression } from "@framework/types";

export const validationSchema = object().shape({
  address: addressValidationSchema,
});