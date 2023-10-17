import { ParameterType } from "@framework/types";
import type { IParameter } from "@framework/types";

export const emptyParameter = {
  parameterName: "",
  parameterType: ParameterType.STRING,
  parameterValue: "",
  parameterMinValue: "",
  parameterMaxValue: "",
} as unknown as IParameter;
