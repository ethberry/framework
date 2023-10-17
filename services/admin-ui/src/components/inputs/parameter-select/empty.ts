import type { IParameter } from "@framework/types";
import { ParameterType } from "@framework/types";

import { getAvailableNames } from "./utils";

export interface IGetEmptyParameter {
  allNames: string[];
  parameters?: IParameter[];
}

export const getEmptyParameter: (props: IGetEmptyParameter) => Partial<IParameter> | null = props => {
  const availableParameterNames = getAvailableNames(props);

  const parameterName = availableParameterNames ? availableParameterNames[0] : null;

  if (!parameterName) {
    return null;
  }

  return {
    parameterName,
    parameterType: ParameterType.NUMBER,
    parameterValue: "0",
    parameterMinValue: "1",
    parameterMaxValue: "5",
  };
};
