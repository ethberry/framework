import { object, string } from "yup";

import { draftValidationSchema } from "@gemunion/yup-rules";
import { bigNumberValidationSchema } from "@gemunion/yup-rules-eth";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

import { dbIdValidationSchema, urlValidationSchema } from "../../../../../../components/validation";

export const validationSchema = object().shape({
  title: string().required("form.validations.valueMissing"),
  description: draftValidationSchema,
  price: templateAssetValidationSchema,
  amount: bigNumberValidationSchema,
  contractId: dbIdValidationSchema,
  imageUrl: urlValidationSchema,
});
