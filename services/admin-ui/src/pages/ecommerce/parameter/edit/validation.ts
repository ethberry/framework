import { mixed, object, string } from "yup";

import { reISO8601 } from "@gemunion/constants";
import { ParameterType } from "@framework/types";

export const validationSchema = object().shape({
  parameterName: string().required("form.validations.valueMissing"),
  parameterType: mixed<ParameterType>().oneOf(Object.values(ParameterType)).required("form.validations.valueMissing"),
  parameterValue: mixed().when("parameterType", {
    is: (parameterType: ParameterType) => parameterType === ParameterType.ENUM,
    then: () => string().required("form.validations.valueMissing"),
    otherwise: () => string().notRequired(),
  }),
  parameterMinValue: mixed()
    .when("parameterType", {
      is: (parameterType: ParameterType) =>
        parameterType === ParameterType.NUMBER || parameterType === ParameterType.STRING,
      then: () => string().notRequired(),
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
      then: () => string().notRequired(),
    })
    .when("parameterType", {
      is: (parameterType: ParameterType) => parameterType === ParameterType.DATE,
      then: () =>
        string().matches(reISO8601, "form.validations.patternMismatch").required("form.validations.valueMissing"),
      otherwise: () => string().notRequired(),
    }),
});
