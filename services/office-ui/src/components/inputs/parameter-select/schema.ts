import { array, mixed, number, object, string } from "yup";

import { ParameterType, ProductParameters } from "@framework/types";
import { reISO8601 } from "@gemunion/constants";

const parameterValidationSchema = object().shape({
  parameterName: mixed<ProductParameters>()
    .oneOf(Object.values(ProductParameters))
    .required("form.validations.valueMissing"),
  parameterType: mixed<ParameterType>().oneOf(Object.values(ParameterType)).required("form.validations.valueMissing"),
  parameterValue: mixed()
    .when("parameterType", {
      is: (parameterType: ParameterType) => parameterType === ParameterType.NUMBER,
      then: () =>
        number()
          .min(0, "form.validations.rangeUnderflow")
          .test({
            name: "max",
            exclusive: false,
            params: {},
            message: "rangeOverflow",
            test: (value, context) => !value || value <= parseFloat(context.parent.parameterValue),
          })
          .integer("form.validations.badInput")
          .required("form.validations.valueMissing"),
    })
    .when("parameterType", {
      is: (parameterType: ParameterType) => parameterType === ParameterType.STRING,
      then: () => string().required("form.validations.valueMissing"),
    })
    .when("parameterType", {
      is: (parameterType: ParameterType) => parameterType === ParameterType.DATE,
      then: () =>
        string().matches(reISO8601, "form.validations.patternMismatch").required("form.validations.valueMissing"),
    }),
  parameterMinValue: number().when("parameterType", {
    is: (parameterType: ParameterType) => parameterType === ParameterType.NUMBER,
    then: () =>
      number()
        .min(0, "form.validations.rangeUnderflow")
        .typeError("form.validations.badInput")
        .integer("form.validations.badInput")
        .required("form.validations.valueMissing"),
    otherwise: () => number().notRequired(),
  }),
  parameterMaxValue: number().when("parameterType", {
    is: (parameterType: ParameterType) => parameterType === ParameterType.NUMBER,
    then: () =>
      number()
        .min(0, "form.validations.rangeUnderflow")
        .typeError("form.validations.badInput")
        .integer("form.validations.badInput")
        .required("form.validations.valueMissing"),
    otherwise: () => number().notRequired(),
  }),
});

export const parametersValidationSchema = array().of(parameterValidationSchema);
