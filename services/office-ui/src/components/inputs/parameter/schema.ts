import { array, mixed, number, object, string } from "yup";

import { reISO8601 } from "@gemunion/constants";
import { GradeAttribute } from "@framework/types";

import { PARAMETER_TYPE } from "./type/interface";

const parameterValidationSchema = object().shape({
  parameterName: mixed<GradeAttribute>().oneOf(Object.values(GradeAttribute)).required("form.validations.valueMissing"),
  parameterType: mixed<PARAMETER_TYPE>().oneOf(Object.values(PARAMETER_TYPE)).required("form.validations.valueMissing"),
  parameterValue: mixed()
    .when("parameterType", {
      is: (parameterType: PARAMETER_TYPE) => parameterType === PARAMETER_TYPE.number,
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
      is: (parameterType: PARAMETER_TYPE) => parameterType === PARAMETER_TYPE.string,
      then: () => string().required("form.validations.valueMissing"),
    })
    .when("parameterType", {
      is: (parameterType: PARAMETER_TYPE) => parameterType === PARAMETER_TYPE.date,
      then: () =>
        string().matches(reISO8601, "form.validations.patternMismatch").required("form.validations.valueMissing"),
    }),
  parameterMaxValue: number().when("parameterType", {
    is: (parameterType: PARAMETER_TYPE) => parameterType === PARAMETER_TYPE.number,
    then: () =>
      number()
        .min(0, "form.validations.rangeUnderflow")
        .typeError("form.validations.badInput")
        .integer("form.validations.badInput")
        .required("form.validations.valueMissing"),
    otherwise: schema => schema.notRequired(),
  }),
});

export const parametersValidationSchema = array().of(parameterValidationSchema);
