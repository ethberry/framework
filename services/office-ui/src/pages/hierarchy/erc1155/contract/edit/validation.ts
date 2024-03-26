import { object } from "yup";

import {
  dbIdValidationSchema,
  draftValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
} from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  address: addressValidationSchema,
  imageUrl: urlValidationSchema,
  merchantId: dbIdValidationSchema,
});
