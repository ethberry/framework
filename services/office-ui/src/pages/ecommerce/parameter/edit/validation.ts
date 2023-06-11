import { array, mixed, number, object, string } from "yup";

import { ParameterType } from "@framework/types";
import { reISO8601 } from "@gemunion/constants";

export const validationSchema = object().shape({
  parameterName: string().required("form.validations.valueMissing"),
  parameterType: mixed<ParameterType>().oneOf(Object.values(ParameterType)).required("form.validations.valueMissing"),
  parameterValue: array().of(
    mixed().when("parameterType", {
      is: (parameterType: ParameterType) => parameterType === ParameterType.ENUM,
      then: () => string().required("form.validations.valueMissing"),
      otherwise: () => mixed().notRequired(),
    }),
  ),
  parameterMinValue: mixed()
    .when("parameterType", {
      is: (parameterType: ParameterType) =>
        parameterType === ParameterType.NUMBER || parameterType === ParameterType.STRING,
      then: () =>
        number()
          .min(0, "form.validations.rangeUnderflow")
          .typeError("form.validations.badInput")
          .integer("form.validations.badInput")
          .required("form.validations.valueMissing"),
    })
    .when("parameterType", {
      is: (parameterType: ParameterType) => parameterType === ParameterType.DATE,
      then: () =>
        string().matches(reISO8601, "form.validations.patternMismatch").required("form.validations.valueMissing"),
      otherwise: () => mixed().notRequired(),
    }),
  parameterMaxValue: mixed()
    .when("parameterType", {
      is: (parameterType: ParameterType) =>
        parameterType === ParameterType.NUMBER || parameterType === ParameterType.STRING,
      then: () =>
        number()
          .min(0, "form.validations.rangeUnderflow")
          .typeError("form.validations.badInput")
          .integer("form.validations.badInput")
          .required("form.validations.valueMissing"),
    })
    .when("parameterType", {
      is: (parameterType: ParameterType) => parameterType === ParameterType.DATE,
      then: () =>
        string().matches(reISO8601, "form.validations.patternMismatch").required("form.validations.valueMissing"),
      otherwise: () => mixed().notRequired(),
    }),
});
