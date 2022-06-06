import * as Yup from "yup";
import { SettingsKeys } from "@framework/types";

const fields = Object.keys(SettingsKeys).reduce(
  (memo, key) => Object.assign(memo, { [key]: Yup.string().required("form.validations.valueMissing") }),
  {},
);

export const validationSchema = Yup.object().shape(fields);
