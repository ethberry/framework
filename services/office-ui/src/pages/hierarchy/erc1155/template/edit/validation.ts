import { object } from "yup";

import {
  dbIdValidationSchema,
  draftValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
} from "@ethberry/yup-rules";
import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";
import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  price: templateAssetValidationSchema,
  amount: bigNumberValidationSchema,
  contractId: dbIdValidationSchema,
  imageUrl: urlValidationSchema,
});
