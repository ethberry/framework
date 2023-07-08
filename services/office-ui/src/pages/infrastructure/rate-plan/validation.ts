import { object, string } from "yup";

import { SettingsKeys } from "@framework/types";

const fields = Object.keys(SettingsKeys).reduce(
  (memo, key) => Object.assign(memo, { [key]: string().required("form.validations.valueMissing") }),
  {},
);

export const validationSchema = object().shape(fields);
