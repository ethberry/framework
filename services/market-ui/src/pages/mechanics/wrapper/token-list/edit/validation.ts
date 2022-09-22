import * as Yup from "yup";

import { tokenValidationSchema } from "../../../../../components/inputs/price/token-schema";

export const validationSchema = Yup.object().shape({
  item: tokenValidationSchema,
});
