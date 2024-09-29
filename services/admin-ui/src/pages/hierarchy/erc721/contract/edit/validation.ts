import { object } from "yup";

import {
  draftValidationSchema,
  symbolValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
} from "@ethberry/yup-rules";
import { addressValidationSchema } from "@ethberry/yup-rules-eth";

export const validationSchema = object().shape({
  symbol: symbolValidationSchema,
  title: titleValidationSchema,
  description: draftValidationSchema,
  address: addressValidationSchema,
  imageUrl: urlValidationSchema,
});
