import { IParameter, ParameterType } from "@framework/types";

export const emptyParameter = {
  parameterName: "",
  parameterType: ParameterType.STRING,
  parameterValue: "",
  parameterMinValue: "",
  parameterMaxValue: "",
} as unknown as IParameter;
