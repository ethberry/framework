import { object } from "yup";

import {
  dbIdValidationSchema,
  draftValidationSchema,
  symbolValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
} from "@gemunion/yup-rules";
import { addressValidationSchema } from "@gemunion/yup-rules-eth";

export const validationSchema = object().shape({
  symbol: symbolValidationSchema,
  title: titleValidationSchema,
  description: draftValidationSchema,
  address: addressValidationSchema,
  imageUrl: urlValidationSchema,
  merchantId: dbIdValidationSchema,
});
